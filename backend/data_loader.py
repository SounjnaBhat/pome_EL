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
    df = load_dataset()
    filtered = df

    if category:
        filtered = filtered[filtered["category"] == category]

    if query:
        filtered = filtered[
            filtered["app_name"].str.contains(query, case=False, na=False)
        ]

    return _clean_records(filtered.head(limit))
