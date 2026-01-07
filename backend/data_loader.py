from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np
import pandas as pd

DATA_PATH = Path(__file__).parent / "data" / "apps_master_dataset.csv"


@lru_cache(maxsize=1)
def load_dataset() -> pd.DataFrame:
    """Load the master dataset once and reuse it across requests."""
    return pd.read_csv(DATA_PATH)


def _clean_record(rec: Dict) -> Dict:
    """Replace NaN/inf with None for JSON safety."""
    cleaned = {}
    for k, v in rec.items():
        if isinstance(v, float) and (np.isnan(v) or np.isinf(v)):
            cleaned[k] = None
        else:
            cleaned[k] = v
    return cleaned


def _clean_records(df: pd.DataFrame) -> List[Dict]:
    """Return JSON-safe records (no NaN/inf)."""
    return [_clean_record(rec) for rec in df.to_dict(orient="records")]


def get_app_by_name(app_name: str) -> Optional[Dict]:
    df = load_dataset()
    result = df[df["app_name"].str.lower() == app_name.lower()]
    if result.empty:
        return None
    return _clean_record(result.iloc[0].to_dict())


def get_apps_by_names(app_names: List[str]) -> Dict[str, Dict]:
    """Return a mapping of normalized app name -> app record for selected apps only."""
    df = load_dataset()
    normalized = {name.strip().lower() for name in app_names}
    filtered = df[df["app_name"].str.lower().isin(normalized)]
    return {row["app_name"].strip().lower(): _clean_record(row.to_dict()) for _, row in filtered.iterrows()}


def search_apps(query: str, category: str = None, limit: int = 20):
    """Search apps with results sorted by rating (highest first).
    For Communication category, uses strict whitelist to avoid dummy apps."""
    df = load_dataset()
    filtered = df

    if category:
        # Case-insensitive category matching
        category_str = str(category).strip()
        category_mask = (
            (filtered["category"].astype(str).str.strip().str.lower() == category_str.lower()) |
            (filtered["category"].astype(str).str.contains(category_str, case=False, na=False))
        )
        filtered = filtered[category_mask]

    if query:
        filtered = filtered[
            filtered["app_name"].str.contains(query, case=False, na=False)
        ]

    # For Communication/Messaging: Apply strict whitelist (NO ratings-based selection)
    if category and ("communication" in str(category).lower() or "messaging" in str(category).lower()):
        known_good_apps = {
            "whatsapp", "telegram", "signal", "discord", "messenger", "slack",
            "wechat", "line", "viber", "skype", "zoom", "google meet",
            "microsoft teams", "imessage", "facebook messenger", "hangouts",
            "imo", "plus messenger", "telegram x"
        }
        app_names_lower = filtered["app_name"].str.lower().str.strip()
        good_app_mask = pd.Series([False] * len(filtered), index=filtered.index)
        
        # Exact matches
        good_app_mask |= app_names_lower.isin(known_good_apps)
        
        # Partial matches with word boundaries
        for good_app in known_good_apps:
            pattern = r"\b" + good_app.replace(" ", r"\s+") + r"\b"
            good_app_mask |= app_names_lower.str.contains(pattern, case=False, na=False, regex=True)
        
        # Starts with known good app name
        for good_app in known_good_apps:
            good_app_mask |= app_names_lower.str.startswith(good_app, na=False)
        
        # Remove dummy apps
        dummy_patterns = ["bs-mobile", "bv", "cb browser", "ej messenger", "chat dz"]
        dummy_mask = app_names_lower.str.contains("|".join(dummy_patterns), case=False, na=False, regex=True)
        
        filtered = filtered[good_app_mask & ~dummy_mask].copy()

    # Sort by global_rank first (if available), then rating, then app_name
    # This ensures popular apps appear first, NOT rating-based
    filtered = filtered.copy()
    filtered["rating"] = pd.to_numeric(filtered["rating"], errors="coerce")
    
    if "global_rank" in filtered.columns:
        filtered["global_rank"] = pd.to_numeric(filtered["global_rank"], errors="coerce")
        filtered = filtered.sort_values(
            by=["global_rank", "rating", "app_name"],
            ascending=[True, False, True],  # Lower rank = more popular = first
            na_position="last"
        )
    else:
        filtered = filtered.sort_values(
            by=["rating", "app_name"],
            ascending=[False, True],
            na_position="last"
        )

    return _clean_records(filtered.head(limit))
