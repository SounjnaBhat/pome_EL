from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

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


def compute_feature_dominance(df: pd.DataFrame, feature_cols: List[str], preferences: Dict) -> List[Dict]:
    """Feature Dominance Index (FDI): normalized, preference-weighted dominance within a cohort."""
    available = [c for c in feature_cols if c in df.columns]
    if not available or df.empty:
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

    return [
        {
            "app_name": str(app_names.loc[idx]),
            "dominance_index": round(float(dominance_values.loc[idx]), 4),
        }
        for idx in dominance_values.index
    ]


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


def simulate_preference_scenarios(apps: List[Dict], scenarios: List[Dict], mode: str = "FULL") -> List[Dict]:
    """Run multiple preference profiles to observe ranking shifts."""
    results = []
    for scenario in scenarios:
        name = scenario.get("name", "scenario")
        prefs = scenario.get("preferences", {})
        ranked = []
        for app in apps:
            score, breakdown = calculate_score_with_explainability(app, prefs, mode)
            ranked.append(
                {
                    "app": app.get("app_name"),
                    "score": score,
                    "breakdown": breakdown,
                }
            )
        ranked.sort(key=lambda x: x["score"], reverse=True)
        results.append({"scenario": name, "ranked": ranked})
    return results


def regional_asymmetry(df: pd.DataFrame, category: str, preferences: Dict) -> List[Dict]:
    """Compare dominance and rankings across regions/platforms within a category."""
    region_col = "region" if "region" in df.columns else ("platform" if "platform" in df.columns else None)
    if region_col is None:
        return []

    filtered = df[df["category"] == category] if category else df
    if filtered.empty:
        return []

    regions = []
    for region, region_df in filtered.groupby(region_col):
        dominance = compute_feature_dominance(region_df, FEATURE_COLUMNS, preferences)
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
