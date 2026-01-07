from typing import Dict, List, Tuple
import json
import logging

import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False
    logger.warning("google-generativeai not installed. Gemini features will be disabled.")

# Core feature columns used across analytics
FEATURE_COLUMNS: List[str] = [
    "rating",
    "feature_richness_score",
    "ease_of_use_score",
    "performance_score",
    "customization_score",
    "support_quality_score",
    "privacy_score",
    "service_breadth_score",
]

# Globally popular apps (for popularity proxy when installs/reviews unavailable)
POPULAR_APPS_BY_CATEGORY = {
    "Messaging": {"WhatsApp", "Telegram", "Messenger", "WeChat", "Line", "Viber"},
    "Social Media": {"Facebook", "Instagram", "Twitter", "TikTok", "Snapchat", "LinkedIn"},
    "Entertainment": {"YouTube", "Netflix", "Spotify", "Disney+", "Prime Video"},
    "E-Commerce": {"Amazon Shopping", "Flipkart", "eBay", "Shopee"},
    "Finance": {"Google Pay", "PayPal", "PhonePe", "Paytm"},
    "Travel": {"Uber", "Ola", "Airbnb", "Booking.com"},
    "Food Delivery": {"Swiggy", "Zomato", "Uber Eats", "DoorDash", "Grubhub"},
    "Education": {"Duolingo", "Coursera", "Khan Academy"},
    "Productivity": {"Google Drive", "Dropbox", "Microsoft Teams", "Zoom", "Notion"},
}


def _score_components(app: Dict, preferences: Dict, mode: str = "FULL") -> List[Dict]:
    """Return per-feature contributions for explainability and reuse in metrics."""
    components: List[Dict] = []

    def add(label: str, value: float, weight_key: str):
        weight = preferences.get(weight_key, 5)
        components.append(
            {
                "feature": label,
                "value": float(value) if value is not None else 0.0,
                "weight": float(weight),
                "contribution": float(value) * float(weight) if value is not None else 0.0,
            }
        )

    # Public attributes (always included)
    add("rating", app.get("rating", 0), "rating")
    add("price", 1 if app.get("price_inr", 0) == 0 else 0, "price")

    if mode == "FULL":
        add("featureRichness", app.get("feature_richness_score", 0), "featureRichness")
        add("easeOfUse", app.get("ease_of_use_score", 0), "easeOfUse")
        add("performance", app.get("performance_score", 0), "performance")
        add("serviceIntegration", app.get("service_breadth_score", 0), "serviceIntegration")
        add("customization", app.get("customization_score", 0), "customization")
        add("supportQuality", app.get("support_quality_score", 0), "supportQuality")
        add("privacy", app.get("privacy_score", 0), "privacy")

    return components


def calculate_score(app: Dict, preferences: Dict, mode: str = "FULL") -> float:
    components = _score_components(app, preferences, mode)
    weight_sum = sum(c["weight"] for c in components)
    score_sum = sum(c["contribution"] for c in components)
    return round(score_sum / weight_sum, 2) if weight_sum else 0.0


def calculate_score_with_explainability(app: Dict, preferences: Dict, mode: str = "FULL") -> Tuple[float, List[Dict]]:
    components = _score_components(app, preferences, mode)
    weight_sum = sum(c["weight"] for c in components)
    score_sum = sum(c["contribution"] for c in components)
    score = round(score_sum / weight_sum, 2) if weight_sum else 0.0

    if weight_sum:
        for comp in components:
            comp["normalized_share"] = round(comp["contribution"] / score_sum, 4) if score_sum else 0.0
    else:
        for comp in components:
            comp["normalized_share"] = 0.0

    return score, components


def compute_feature_dominance(df: pd.DataFrame, feature_cols: List[str], preferences: Dict, selected_app_names: List[str] = None) -> List[Dict]:
    """Feature Dominance Index (FDI): normalized, preference-weighted dominance within a cohort.
    
    CRITICAL: If selected_app_names is provided, only computes dominance for those apps.
    The input df should already be filtered to selected apps, but this adds an extra guard.
    """
    available = [c for c in feature_cols if c in df.columns]
    if not available or df.empty:
        return []

    # Guard: Filter df to only selected apps if list provided
    if selected_app_names is not None and len(selected_app_names) > 0:
        selected_normalized = {name.strip().lower() for name in selected_app_names}
        df = df[df["app_name"].str.lower().isin(selected_normalized)]
        if df.empty:
            return []

    subset = df[available].astype(float)
    min_vals = subset.min()
    max_vals = subset.max()
    denom = (max_vals - min_vals).replace(0, 1)
    normalized = (subset - min_vals) / denom

    weights = np.array([preferences.get(_pref_key_from_col(col), 1.0) for col in available], dtype=float)
    weight_sum = weights.sum() if weights.sum() else len(weights)
    weighted = normalized.mul(weights, axis=1)
    dominance = weighted.sum(axis=1) / weight_sum

    if dominance.empty:
        return []

    # Reset indices so app names and dominance values are aligned by position
    dominance_values = dominance.reset_index(drop=True)
    app_names = df["app_name"].reset_index(drop=True)

    results = [
        {
            "app_name": str(app_names.loc[idx]),
            "dominance_index": round(float(dominance_values.loc[idx]), 4),
        }
        for idx in dominance_values.index
    ]
    
    # Final guard: filter results to only selected apps
    if selected_app_names is not None and len(selected_app_names) > 0:
        selected_normalized = {name.strip().lower() for name in selected_app_names}
        results = [r for r in results if r["app_name"].lower() in selected_normalized]
    
    return results


def compute_consumer_confusion(df: pd.DataFrame, feature_cols: List[str]) -> float:
    """Consumer Confusion Score (CCS): increases with more apps and lower variance."""
    available = [c for c in feature_cols if c in df.columns]
    if len(df) < 2 or not available:
        return 0.0

    subset = df[available].astype(float)
    ranges = (subset.max() - subset.min()).replace(0, 1)
    norm_var = (subset.var(ddof=0) / (ranges ** 2)).clip(lower=0)
    similarity = 1 - norm_var.mean()

    confusion = (1 + np.log1p(len(df))) * similarity
    return round(float(confusion), 4)


def simulate_preference_scenarios(apps: List[Dict], scenarios: List[Dict], mode: str = "FULL", selected_app_names: List[str] = None) -> List[Dict]:
    """Run multiple preference profiles to observe ranking shifts.
    
    CRITICAL: Only includes apps from the apps list (which should already be filtered),
    but adds an extra guard check if selected_app_names is provided.
    """
    # Guard: Filter apps to only selected ones
    if selected_app_names is not None and len(selected_app_names) > 0:
        selected_normalized = {name.strip().lower() for name in selected_app_names}
        apps = [app for app in apps if app.get("app_name", "").lower() in selected_normalized]
    
    results = []
    for scenario in scenarios:
        name = scenario.get("name", "scenario")
        prefs = scenario.get("preferences", {})
        ranked = []
        for app in apps:
            app_name = app.get("app_name")
            # Additional guard check
            if selected_app_names is not None and len(selected_app_names) > 0:
                if app_name.lower() not in {name.strip().lower() for name in selected_app_names}:
                    continue
            score, breakdown = calculate_score_with_explainability(app, prefs, mode)
            ranked.append(
                {
                    "app": app_name,
                    "score": score,
                    "breakdown": breakdown,
                }
            )
        ranked.sort(key=lambda x: x["score"], reverse=True)
        results.append({"scenario": name, "ranked": ranked})
    return results


def regional_asymmetry(df: pd.DataFrame, category: str, preferences: Dict, selected_app_names: List[str] = None) -> List[Dict]:
    """Compare dominance and rankings across regions/platforms within a category.
    
    CRITICAL: Only includes apps that are in selected_app_names (if provided).
    If selected_app_names is None or empty, returns empty list to prevent showing unselected apps.
    """
    # Guard: Only operate on selected apps
    if selected_app_names is None or len(selected_app_names) == 0:
        return []
    
    region_col = "region" if "region" in df.columns else ("platform" if "platform" in df.columns else None)
    if region_col is None:
        return []

    # Filter by category AND selected apps only
    filtered = df[df["category"] == category] if category else df
    if filtered.empty:
        return []
    
    # CRITICAL: Filter to only selected apps
    if selected_app_names:
        selected_normalized = {name.strip().lower() for name in selected_app_names}
        filtered = filtered[filtered["app_name"].str.lower().isin(selected_normalized)]
        if filtered.empty:
            return []
    else:
        return []

    regions = []
    for region, region_df in filtered.groupby(region_col):
        # Compute dominance only on selected apps in this region
        dominance = compute_feature_dominance(region_df, FEATURE_COLUMNS, preferences, selected_app_names=selected_app_names)
        # Additional guard: filter results to only selected apps
        if selected_app_names:
            selected_normalized = {name.strip().lower() for name in selected_app_names}
            dominance = [d for d in dominance if d["app_name"].lower() in selected_normalized]
        if dominance:  # Only add regions that have selected apps
            regions.append(
                {
                    "region": region,
                    "count": len(region_df),
                    "dominance": sorted(dominance, key=lambda x: x["dominance_index"], reverse=True)[:5],
                }
            )
    return regions


def _pref_key_from_col(col: str) -> str:
    mapping = {
        "rating": "rating",
        "feature_richness_score": "featureRichness",
        "ease_of_use_score": "easeOfUse",
        "performance_score": "performance",
        "customization_score": "customization",
        "support_quality_score": "supportQuality",
        "privacy_score": "privacy",
        "service_breadth_score": "serviceIntegration",
    }
    return mapping.get(col, col)


def calculate_popularity_score(app: Dict, category: str = None) -> float:
    """Calculate a popularity proxy score (0-10) based on rating, reviews, and known popularity.
    
    This is a proxy since install/review data may be unavailable. Higher scores indicate
    more popular apps globally.
    """
    score = 0.0
    
    # Base score from rating (0-5 scale, normalize to 0-5)
    # Safely convert rating to float, handling None, strings, and numeric types
    rating_raw = app.get("rating", 0.0)
    try:
        if rating_raw is None:
            rating = 0.0
        elif isinstance(rating_raw, str):
            rating = float(rating_raw) if rating_raw.strip() else 0.0
        else:
            rating = float(rating_raw)
    except (ValueError, TypeError):
        rating = 0.0
    
    score += min(rating, 5.0)  # Max 5 points
    
    # Bonus for reviews (if available and > 0)
    reviews_raw = app.get("reviews_count", 0) or 0
    try:
        if reviews_raw is None:
            reviews = 0
        elif isinstance(reviews_raw, str):
            reviews = int(float(reviews_raw)) if reviews_raw.strip() else 0
        else:
            reviews = int(reviews_raw)
    except (ValueError, TypeError):
        reviews = 0
    
    if reviews > 0:
        # Logarithmic scale: log10(reviews) / 2, capped at 2 points
        import math
        score += min(math.log10(max(reviews, 1)) / 2, 2.0)
    
    # Bonus for known popular apps by category
    app_name = app.get("app_name", "")
    if category and category in POPULAR_APPS_BY_CATEGORY:
        if app_name in POPULAR_APPS_BY_CATEGORY[category]:
            score += 3.0  # Significant boost for globally popular apps
    
    # Normalize to 0-10 scale (with some headroom, but cap at 10)
    return min(round(score, 2), 10.0)


def generate_ai_overview(
    winner_app: Dict,
    winner_score: float,
    winner_breakdown: List[Dict],
    all_scores: List[Dict],
    preferences: Dict,
    api_key: str = None
) -> str:
    """Generate a natural language explanation of why the top app was selected.
    
    Uses structured analytics output as input. Does NOT influence ranking.
    """
    app_name = winner_app.get("app_name", "the selected app")
    
    # Find top contributing features
    if winner_breakdown:
        sorted_features = sorted(winner_breakdown, key=lambda x: x.get("contribution", 0), reverse=True)
        top_features = sorted_features[:3]
        
        top_contributors = []
        for feat in top_features:
            feat_name = feat.get("feature", "")
            contribution_pct = feat.get("normalized_share", 0) * 100
            weight = feat.get("weight", 0)
            
            if contribution_pct > 5:  # Only mention features with >5% contribution
                # Convert camelCase or snake_case to readable format
                import re
                readable_name = re.sub(r'([A-Z])', r' \1', feat_name).replace('_', ' ').strip().title()
                top_contributors.append(f"{readable_name} (weight: {weight:.1f}, contributes {contribution_pct:.1f}%)")
        
        if top_contributors:
            contributor_text = ", ".join(top_contributors[:2])  # Top 2 features
        else:
            contributor_text = "balanced feature set"
    else:
        contributor_text = "balanced feature set"
    
    # Compare with runner-up if available
    comparison_text = ""
    if len(all_scores) > 1:
        runner_up = all_scores[1] if all_scores[1].get("app") != app_name else (all_scores[2] if len(all_scores) > 2 else None)
        if runner_up:
            runner_score = runner_up.get("score", 0)
            score_diff = winner_score - runner_score
            if score_diff < 0.3:
                comparison_text = f" It closely edges out {runner_up.get('app')} (score: {runner_score:.1f}), indicating a competitive market where preferences matter significantly."
            elif score_diff < 1.0:
                comparison_text = f" It outperforms {runner_up.get('app')} (score: {runner_score:.1f}) by {score_diff:.1f} points, demonstrating clear differentiation in the selected feature priorities."
    
    # Build explanation
    explanation = (
        f"{app_name} emerges as the top recommendation with a score of {winner_score:.1f}/10. "
        f"This selection is primarily driven by strong performance in: {contributor_text}. "
        f"The app aligns well with your specified preference weights, where higher-weighted attributes "
        f"significantly influence the final ranking.{comparison_text}"
    )
    
    return explanation


def generate_detailed_app_comparison(
    app_data: Dict,
    app_score: float,
    app_breakdown: List[Dict],
    all_apps_data: List[Dict],
    all_scores: List[Dict],
    preferences: Dict,
    api_key: str = None
) -> str:
    """Generate a detailed, nuanced comparison for a specific app using Gemini.
    Especially useful when scores are identical - explains real-world differences.
    """
    app_name = app_data.get("app_name", "the app")
    
    # Check if scores are identical or very close
    identical_scores = False
    if len(all_scores) > 1:
        top_score = max(s.get("score", 0) for s in all_scores)
        score_diff = abs(app_score - top_score)
        identical_scores = score_diff < 0.01  # Essentially identical
    
    # Prepare app details for Gemini
    app_details = {
        "name": app_name,
        "score": app_score,
        "category": app_data.get("category", "Unknown"),
        "developer": app_data.get("developer", "Unknown"),
        "rating": app_data.get("rating", 0),
        "price": app_data.get("price_inr", 0),
        "platforms": app_data.get("platforms", "Unknown"),
        "mau_millions": app_data.get("mau_millions", 0),
        "global_rank": app_data.get("global_rank", 999),
    }
    
    # Get top contributing features
    top_features = []
    if app_breakdown:
        sorted_features = sorted(app_breakdown, key=lambda x: x.get("contribution", 0), reverse=True)
        for feat in sorted_features[:3]:
            feat_name = feat.get("feature", "")
            contribution_pct = feat.get("normalized_share", 0) * 100
            top_features.append(f"{feat_name}: {contribution_pct:.1f}%")
    
    # Prepare comparison context
    other_apps = []
    for score_data in all_scores:
        if score_data.get("app", "").lower() != app_name.lower():
            other_apps.append({
                "name": score_data.get("app", ""),
                "score": score_data.get("score", 0)
            })
    
    # Use Gemini if API key is available
    if api_key and HAS_GEMINI:
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""You are an expert app analyst providing detailed, nuanced insights about applications.

APP TO ANALYZE:
{json.dumps(app_details, indent=2)}

TOP CONTRIBUTING FEATURES:
{', '.join(top_features) if top_features else 'Balanced across all features'}

COMPARISON CONTEXT:
- Overall Score: {app_score:.1f}/10
- Other apps in comparison: {', '.join([a['name'] for a in other_apps])}
- Scores are {'IDENTICAL or very close' if identical_scores else 'different'}

USER PREFERENCES (weights):
{json.dumps(preferences, indent=2)}

TASK:
Provide a detailed, nuanced analysis of {app_name} that explains:
1. Real-world strengths and differentiators (beyond numerical scores)
2. Market positioning and brand recognition
3. User experience characteristics
4. Network effects and ecosystem advantages
5. Subtle feature differences that matter in practice
6. Why users might choose this app despite identical scores

IMPORTANT:
- Be specific and concrete, not generic
- Focus on real-world usage patterns
- Explain what makes this app unique or preferred
- If scores are identical, explain the practical differences that matter
- Keep it concise (2-3 sentences, maximum 150 words)

OUTPUT FORMAT:
Return ONLY the analysis text. No markdown, no code blocks, no labels. Just the explanation."""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean response
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json") or response_text.startswith("text"):
                    response_text = response_text[4:]
            response_text = response_text.strip()
            
            if response_text:
                return response_text
        except Exception as e:
            logger.warning(f"Gemini detailed comparison failed for {app_name}: {e}")
    
    # Fallback: Template-based explanation
    if identical_scores:
        return f"{app_name} offers a competitive experience with a score of {app_score:.1f}/10. While the numerical scores are identical, this app distinguishes itself through real-world factors like network effects, brand recognition, and user base size. Consider your specific needs, ecosystem preferences, and the communities you're already part of when making your choice."
    else:
        return f"{app_name} scores {app_score:.1f}/10 based on your preferences. The app performs well across the evaluated attributes, with particular strengths in the weighted features you prioritized."


def get_graph_ready_outputs(
    app_data_map: Dict[str, Dict],
    explainability_data: List[Dict],
    fdi_data: List[Dict],
    confusion_score: float,
    category: str = None
) -> Dict:
    """Generate graph-ready data structures for academic figures.
    
    Args:
        app_data_map: Dict mapping normalized app name -> app data dict
        explainability_data: List of explainability results
        fdi_data: List of FDI results
        confusion_score: Consumer confusion score
        category: Category name (optional)
    
    Returns:
    - feature_contributions: Dict with app_name -> Dict of feature -> percentage
    - dominance_vs_popularity: List of Dicts with app_name, dominance_index, popularity_score
    - confusion_by_category: Dict with category -> confusion_score (if available)
    """
    # 1. Feature contribution breakdown (percentages)
    feature_contributions = {}
    for explain in explainability_data:
        app_name = explain.get("app", "")
        breakdown = explain.get("breakdown", [])
        contributions = {}
        for feat in breakdown:
            feat_name = feat.get("feature", "")
            percentage = feat.get("normalized_share", 0) * 100
            contributions[feat_name] = round(percentage, 2)
        feature_contributions[app_name] = contributions
    
    # 2. Dominance vs Popularity data points
    dominance_vs_popularity = []
    fdi_map = {entry.get("app_name", "").lower(): entry.get("dominance_index", 0) for entry in fdi_data}
    
    for explain in explainability_data:
        app_name = explain.get("app", "")
        app_normalized = app_name.lower()
        
        # Get app data from the map
        app_dict = app_data_map.get(app_normalized, {})
        if not app_dict:
            # If category not in app_dict, try to get it from the map
            pass
        
        popularity = calculate_popularity_score(app_dict, category)
        dominance = fdi_map.get(app_normalized, 0.0)
        
        dominance_vs_popularity.append({
            "app_name": app_name,
            "dominance_index": round(dominance, 4),
            "popularity_score": round(popularity, 2)
        })
    
    # 3. Confusion score per category (if category provided)
    confusion_by_category = {}
    if category:
        confusion_by_category[category] = round(confusion_score, 4)
    
    return {
        "feature_contributions": feature_contributions,
        "dominance_vs_popularity": dominance_vs_popularity,
        "confusion_by_category": confusion_by_category
    }
