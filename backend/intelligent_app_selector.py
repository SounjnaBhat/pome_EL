"""
Intelligent App Selection System using Gemini API.
Acts as an intermediate reasoning layer between dataset and frontend.
"""

import json
import logging
from typing import Dict, List, Optional
import pandas as pd

logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False
    logger.warning("google-generativeai not installed. Falling back to rule-based selection.")


def prepare_apps_dataframe_for_gemini(df: pd.DataFrame, category: str = None, query: str = None, limit: int = 50) -> pd.DataFrame:
    """Prepare a filtered and enriched dataset for Gemini analysis."""
    filtered = df.copy()
    
    # Filter by query if provided
    if query and query.strip():
        filtered = filtered[filtered["app_name"].str.contains(query, case=False, na=False)]
    
    # Filter by category if provided (case-insensitive matching)
    if category:
        if "category" in filtered.columns:
            # Handle both string and numeric category values
            category_str = str(category).strip()
            
            # Map common category names (Communication -> Messaging, etc.)
            category_mapping = {
                "Communication": ["Messaging", "Communication", "COMMUNICATION"],
                "Messaging": ["Messaging", "Communication", "COMMUNICATION"],
                "Search": ["Search", "SEARCH"],
                "Cloud Storage": ["Cloud Storage", "CLOUD STORAGE"],
                "Email": ["Email", "EMAIL", "Communication"],
                "Social Media": ["Social Media", "SOCIAL", "SOCIAL MEDIA"],
            }
            
            # Get all possible category names to match
            categories_to_match = category_mapping.get(category_str, [category_str])
            
            # Case-insensitive matching
            category_mask = pd.Series([False] * len(filtered), index=filtered.index)
            filtered_categories_lower = filtered["category"].astype(str).str.strip().str.lower()
            category_str_lower = category_str.lower()
            
            for cat in categories_to_match:
                cat_lower = cat.lower()
                category_mask |= (
                    (filtered_categories_lower == cat_lower) |
                    (filtered_categories_lower.str.contains(cat_lower, case=False, na=False)) |
                    (filtered_categories_lower.str.contains(category_str_lower, case=False, na=False))
                )
            
            filtered = filtered[category_mask].copy()
            logger.info(f"Filtered to {len(filtered)} apps for category '{category_str}' (matched: {categories_to_match})")
    
    # Select relevant columns
    columns_to_include = ["app_name", "category", "rating", "global_rank", "mau_millions", 
                          "platforms", "primary_use", "developer"]
    
    # Only include columns that exist
    available_columns = [col for col in columns_to_include if col in filtered.columns]
    filtered = filtered[available_columns].copy()
    
    # Remove duplicates by app_name
    filtered = filtered.drop_duplicates(subset=["app_name"], keep="first")
    
    # Sort by potential relevance (rating, MAU, rank)
    if "rating" in filtered.columns:
        filtered["rating"] = pd.to_numeric(filtered["rating"], errors="coerce")
    if "mau_millions" in filtered.columns:
        filtered["mau_millions"] = pd.to_numeric(filtered["mau_millions"], errors="coerce")
    if "global_rank" in filtered.columns:
        filtered["global_rank"] = pd.to_numeric(filtered["global_rank"], errors="coerce")
    
    # Pre-filter: Remove obvious low-quality entries
    # Keep apps with at least one of: rating > 3.5, MAU > 10M, or global_rank < 100
    # Initialize mask with filtered dataframe's index to ensure alignment
    quality_mask = pd.Series([False] * len(filtered), index=filtered.index)
    
    if "rating" in filtered.columns:
        rating_norm = pd.to_numeric(filtered["rating"], errors="coerce").fillna(0)
        quality_mask |= (rating_norm > 3.5)
    if "mau_millions" in filtered.columns:
        mau_norm = pd.to_numeric(filtered["mau_millions"], errors="coerce").fillna(0)
        quality_mask |= (mau_norm > 10)
    if "global_rank" in filtered.columns:
        rank_norm = pd.to_numeric(filtered["global_rank"], errors="coerce").fillna(999)
        quality_mask |= (rank_norm < 100)
    
    # If no quality indicators, keep all (let Gemini decide)
    if quality_mask.sum() == 0:
        quality_mask = pd.Series([True] * len(filtered), index=filtered.index)
    
    # Use loc to ensure proper indexing
    filtered = filtered.loc[quality_mask].copy()
    
    # AGGRESSIVE PRE-FILTER: Remove known dummy/unknown apps before sending to Gemini
    known_dummy_apps = {
        "bs-mobile", "bv", "cb browser", "ej messenger", "chat dz",
        "2 amateur ham radio", "amateur ham radio", "ham radio",
        "best browser bd", "cm browser", "cm transfer", "/u/app",
        "clanplay", "should i answer", "morse machine", "cw beacon"
    }
    
    # Whitelist of known good apps for Communication/Messaging
    known_good_apps = {
        "whatsapp", "telegram", "signal", "discord", "messenger", "slack",
        "wechat", "line", "viber", "skype", "zoom", "google meet",
        "microsoft teams", "imessage", "facebook messenger", "hangouts",
        "imo", "plus messenger", "telegram x"
    }
    
    if "app_name" in filtered.columns and len(filtered) > 0:
        app_names_lower = filtered["app_name"].str.lower().str.strip()
        
        # Remove dummy apps
        dummy_patterns = [
            r"^bs-mobile$", r"^bv$", r"cb browser", r"ej messenger", r"chat dz",
            r"amateur ham radio", r"ham radio", r"best browser", r"cm browser",
            r"cm transfer", r"^/u/app$", r"clanplay", r"should i answer",
            r"morse machine", r"cw beacon"
        ]
        dummy_mask = pd.Series([False] * len(filtered), index=filtered.index)
        for pattern in dummy_patterns:
            dummy_mask |= app_names_lower.str.contains(pattern, case=False, na=False, regex=True)
        dummy_mask |= app_names_lower.isin(known_dummy_apps)
        
        # For Communication/Messaging: STRICT WHITELIST - ONLY known good apps
        if category and ("communication" in str(category).lower() or "messaging" in str(category).lower()):
            # STRICT MODE: Only keep known good apps, ignore ratings completely
            good_app_mask = pd.Series([False] * len(filtered), index=filtered.index)
            
            # Check for exact matches first
            good_app_mask |= app_names_lower.isin(known_good_apps)
            
            # Then check for partial matches (e.g., "WhatsApp Messenger" contains "whatsapp")
            for good_app in known_good_apps:
                # Use word boundaries to avoid false matches
                pattern = r"\b" + good_app.replace(" ", r"\s+") + r"\b"
                good_app_mask |= app_names_lower.str.contains(pattern, case=False, na=False, regex=True)
            
            # Also check if app name starts with known good app name
            for good_app in known_good_apps:
                good_app_mask |= app_names_lower.str.startswith(good_app, na=False)
            
            # ONLY keep known good apps, remove everything else (including dummy apps)
            filtered = filtered[good_app_mask & ~dummy_mask].copy()
            logger.info(f"STRICT WHITELIST for Communication: Kept {len(filtered)} known good apps only (removed {dummy_mask.sum()} dummies, ignored ratings)")
            
            if len(filtered) == 0:
                logger.warning("⚠️ No known good apps found after whitelist filtering. This should not happen for Communication category.")
        else:
            # For other categories, just remove dummy apps
            filtered = filtered[~dummy_mask].copy()
            if dummy_mask.sum() > 0:
                logger.info(f"Pre-filtered out {dummy_mask.sum()} known dummy/unknown apps")
    
    # Limit to top candidates for Gemini analysis
    filtered = filtered.head(limit * 2)  # Send 2x to Gemini, let it filter
    
    return filtered


def format_apps_for_gemini_prompt(df: pd.DataFrame) -> str:
    """Format apps dataframe into a readable prompt for Gemini."""
    apps_list = []
    
    for idx, row in df.iterrows():
        app_info = {
            "app_name": str(row.get("app_name", "Unknown")),
            "domain": str(row.get("category", "Unknown")),
        }
        
        # Add optional fields if available
        if "mau_millions" in row and pd.notna(row["mau_millions"]):
            app_info["monthly_active_users_millions"] = float(row["mau_millions"])
        if "rating" in row and pd.notna(row["rating"]):
            app_info["rating"] = float(row["rating"])
        if "global_rank" in row and pd.notna(row["global_rank"]):
            app_info["global_rank"] = int(row["global_rank"])
        if "platforms" in row and pd.notna(row["platforms"]):
            app_info["platforms"] = str(row["platforms"])
        if "primary_use" in row and pd.notna(row["primary_use"]):
            app_info["primary_use"] = str(row["primary_use"])
        if "developer" in row and pd.notna(row["developer"]):
            app_info["developer"] = str(row["developer"])
        
        apps_list.append(app_info)
    
    return json.dumps(apps_list, indent=2)


def intelligent_app_selection(
    df: pd.DataFrame,
    category: str = None,
    query: str = None,
    limit: int = 20,
    api_key: str = None
) -> Dict:
    """
    Use Gemini API to intelligently select and rank apps.
    
    Returns:
        {
            "selected_apps": [
                {
                    "app_name": str,
                    "domain": str,
                    "reason": str,
                    "rank": int
                }
            ],
            "method": "gemini" or "fallback"
        }
    """
    try:
        # Prepare data
        prepared_df = prepare_apps_dataframe_for_gemini(df, category, query, limit)
    except Exception as e:
        logger.error(f"Error preparing dataframe: {e}")
        # Return empty result on error
        return {
            "selected_apps": [],
            "method": "fallback",
            "error": str(e)
        }
    
    if prepared_df.empty:
        return {
            "selected_apps": [],
            "method": "fallback",
            "error": "No apps found matching criteria"
        }
    
    # Try Gemini API if available and key provided
    if HAS_GEMINI and api_key:
        try:
            logger.info(f"Attempting Gemini API call for category: {category}, query: {query}, apps: {len(prepared_df)}")
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Build comprehensive prompt
            apps_json = format_apps_for_gemini_prompt(prepared_df)
            
            # Build domain-specific prompt
            domain_context = ""
            if category:
                category_lower = str(category).lower()
                
                if "communication" in category_lower or "messaging" in category_lower:
                    domain_context = f"""
CRITICAL DOMAIN REQUIREMENTS FOR COMMUNICATION/MESSAGING:

You MUST select apps in this EXACT priority order (if available in dataset):
1. WhatsApp - MUST be #1 if available (2.4 billion users globally)
2. Telegram - MUST be #2 if available (800M users globally)  
3. Signal - MUST be #3 if available (trusted secure messaging)
4. Discord - Select if available (200M users)
5. Messenger - Select if available (1.3B users)
6. Slack - Select if available (workplace messaging)

ABSOLUTE EXCLUSIONS - DO NOT SELECT THESE APPS:
- BS-Mobile (unknown app - EXCLUDE)
- BV (unknown app - EXCLUDE)
- CB Browser (unknown app - EXCLUDE)
- EJ Messenger (unknown app - EXCLUDE)
- Any app with unclear, generic, or unrecognizable name

CRITICAL RULE: If an app name is not immediately recognizable as WhatsApp, Telegram, Signal, Discord, or another major messaging platform, DO NOT select it regardless of rating.
"""
                else:
                    domain_context = f"""
DOMAIN CONTEXT:
You are selecting apps for the "{category}" category. Users expect to see globally recognized, widely-used applications.

For "{category}" category, prioritize well-known, globally dominant apps only.
"""

            prompt = f"""You are an expert app analyst selecting the most relevant and widely-used applications for a "Browse Available Apps" section.

CRITICAL: You must act as a reasoning layer that filters out unknown, dummy, or low-impact apps, even if they have high ratings.

DATASET OF AVAILABLE APPS:
{apps_json}
{domain_context}

SELECTION CRITERIA (IN ORDER OF PRIORITY):
1. GLOBAL POPULARITY & REAL-WORLD USAGE (PRIMARY):
   - Prioritize apps with millions of Monthly Active Users (MAU)
   - Strong brand recognition - apps users would immediately recognize
   - High daily active usage in real-world scenarios
   - Global adoption across multiple regions

2. BRAND TRUST & RECOGNITION (SECONDARY):
   - Well-known companies and developers (Google, Meta, Microsoft, etc.)
   - Established apps with proven track records
   - Apps mentioned in mainstream media and tech discussions

3. CROSS-PLATFORM AVAILABILITY (TERTIARY):
   - Apps available on multiple platforms (Android, iOS, Web)
   - Broader reach indicates higher adoption

4. RATINGS (QUATERNARY - NOT PRIMARY):
   - Ratings should be considered but NOT the main factor
   - A 4.5-rated unknown app should rank BELOW a 4.0-rated globally popular app
   - Ratings alone do NOT reflect real-world popularity

MANDATORY ELIMINATION - ABSOLUTE REQUIREMENTS:
You MUST ABSOLUTELY EXCLUDE these specific apps (even if they have high ratings):
- "BS-Mobile" - DO NOT SELECT THIS APP
- "BV" - DO NOT SELECT THIS APP
- "CB Browser" - DO NOT SELECT THIS APP
- "EJ Messenger" - DO NOT SELECT THIS APP
- Any app with unclear, generic, or unknown names
- Any app that is not immediately recognizable as a major global platform

CRITICAL RULE: If you cannot immediately identify an app as a well-known, globally-used application (like WhatsApp, Telegram, Google Search, etc.), DO NOT select it regardless of rating.

DOMAIN-SPECIFIC EXPECTATIONS:
For "{category if category else 'any category'}", users expect to see:
- The most globally recognized apps in that category
- Apps they would encounter in daily life
- Industry leaders and market dominants

SELECTION COUNT:
- Select exactly {limit} apps
- Rank them by: Global Popularity > Brand Recognition > Real-World Usage > Platform Availability > Ratings

OUTPUT FORMAT (JSON only, no markdown):
{{
  "ranked_apps": [
    {{
      "name": "Exact app name from dataset (e.g., WhatsApp, Telegram, Google Search)",
      "reason": "Brief justification focusing on global popularity and real-world usage (1 sentence)",
      "rank": 1
    }}
  ]
}}

CRITICAL: Return ONLY valid JSON. Do not include any explanatory text, markdown code blocks, or additional commentary before or after the JSON."""

            # Generate response
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean response (remove markdown code blocks if present)
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            # Parse JSON response
            try:
                result = json.loads(response_text)
                
                # Handle both "ranked_apps" and "selected_apps" formats
                apps_list = result.get("ranked_apps") or result.get("selected_apps", [])
                
                # Validate structure
                if isinstance(apps_list, list) and len(apps_list) > 0:
                    # Ensure app names match dataset
                    valid_apps = []
                    app_name_set = set(prepared_df["app_name"].str.strip().str.lower())
                    
                    for app in apps_list:
                        # Handle both "name" and "app_name" keys
                        app_name = app.get("name") or app.get("app_name", "")
                        if app_name and app_name.lower() in app_name_set:
                            valid_apps.append({
                                "app_name": app_name,
                                "domain": app.get("domain") or category or "",
                                "reason": app.get("reason", "Selected by AI analysis based on global popularity"),
                                "rank": app.get("rank", len(valid_apps) + 1)
                            })
                    
                    if valid_apps:
                        logger.info(f"Gemini selected {len(valid_apps)} apps intelligently (category: {category})")
                        return {
                            "selected_apps": valid_apps,
                            "method": "gemini"
                        }
                    else:
                        logger.warning("Gemini returned apps but none matched dataset. Falling back to rule-based selection.")
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse Gemini JSON response: {e}")
                logger.debug(f"Response text: {response_text[:500]}")
        
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Falling back to rule-based selection.")
    
    # Fallback: Rule-based selection (prioritizes MAU/rank over ratings)
    return fallback_selection(prepared_df, limit, category)


def fallback_selection(df: pd.DataFrame, limit: int, category: str = None) -> Dict:
    """Fallback selection using rule-based ranking when Gemini is unavailable.
    Prioritizes MAU and global rank over ratings to avoid dummy apps.
    For Communication category, uses strict whitelist."""
    df = df.copy()
    
    # For Communication/Messaging: Use strict whitelist (same as pre-filter)
    if category and ("communication" in str(category).lower() or "messaging" in str(category).lower()):
        known_good_apps = {
            "whatsapp", "telegram", "signal", "discord", "messenger", "slack",
            "wechat", "line", "viber", "skype", "zoom", "google meet",
            "microsoft teams", "imessage", "facebook messenger", "hangouts",
            "imo", "plus messenger", "telegram x"
        }
        app_names_lower = df["app_name"].str.lower().str.strip()
        good_app_mask = pd.Series([False] * len(df), index=df.index)
        
        # Exact matches
        good_app_mask |= app_names_lower.isin(known_good_apps)
        
        # Partial matches with word boundaries
        for good_app in known_good_apps:
            pattern = r"\b" + good_app.replace(" ", r"\s+") + r"\b"
            good_app_mask |= app_names_lower.str.contains(pattern, case=False, na=False, regex=True)
        
        # Starts with known good app name
        for good_app in known_good_apps:
            good_app_mask |= app_names_lower.str.startswith(good_app, na=False)
        
        df = df[good_app_mask].copy()
        logger.info(f"Fallback: Using whitelist for Communication - {len(df)} apps")
    
    # Pre-filter known dummy apps for fallback too
    dummy_apps = ["BS-Mobile", "BV", "CB Browser", "EJ Messenger", "chat dz"]
    df = df[~df["app_name"].str.contains("|".join(dummy_apps), case=False, na=False)].copy()
    
    # Composite scoring - MAU and rank are PRIMARY, rating is secondary
    score = pd.Series([0.0] * len(df), index=df.index)
    
    # MAU component (0-50 points) - PRIMARY FACTOR
    if "mau_millions" in df.columns:
        mau_norm = pd.to_numeric(df["mau_millions"], errors="coerce").fillna(0)
        # Normalize to 0-50 scale (assuming max MAU around 5000M)
        max_mau = mau_norm.max() if mau_norm.max() > 0 else 5000
        score += (mau_norm / max_mau) * 50
    
    # Global rank component (0-30 points) - SECONDARY FACTOR
    if "global_rank" in df.columns:
        rank_norm = pd.to_numeric(df["global_rank"], errors="coerce").fillna(999)
        # Lower rank = higher score
        max_rank = rank_norm.max() if rank_norm.max() < 999 else 100
        score += (1 - (rank_norm - 1) / max_rank) * 30
    
    # Rating component (0-20 points) - TERTIARY FACTOR (not primary!)
    if "rating" in df.columns:
        rating_norm = pd.to_numeric(df["rating"], errors="coerce").fillna(0)
        score += (rating_norm / 5.0) * 20
    
    df["composite_score"] = score
    
    # Filter out obvious low-quality apps (apps with no MAU, no rank, and suspiciously high ratings)
    if "mau_millions" in df.columns and "global_rank" in df.columns:
        # Keep apps that have either MAU > 10M OR global_rank < 100 OR rating > 4.5
        quality_mask = (
            (pd.to_numeric(df["mau_millions"], errors="coerce").fillna(0) > 10) |
            (pd.to_numeric(df["global_rank"], errors="coerce").fillna(999) < 100) |
            (pd.to_numeric(df["rating"], errors="coerce").fillna(0) > 4.5)
        )
        df = df[quality_mask].copy()
    
    # Sort by composite score
    df = df.sort_values("composite_score", ascending=False)
    
    # Select top apps
    selected = df.head(limit)
    
    selected_apps = []
    for idx, (_, row) in enumerate(selected.iterrows(), 1):
        selected_apps.append({
            "app_name": str(row["app_name"]),
            "domain": str(row.get("category", category or "Unknown")),
            "reason": f"Selected based on real-world usage metrics (MAU and global popularity prioritized over ratings)",
            "rank": idx
        })
    
    logger.info(f"Fallback selection: {len(selected_apps)} apps selected (prioritizing MAU/rank over ratings)")
    return {
        "selected_apps": selected_apps,
        "method": "fallback"
    }

