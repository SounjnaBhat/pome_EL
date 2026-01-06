from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from data_loader import get_app_by_name, get_apps_by_names, load_dataset, search_apps
from comparison import (
    FEATURE_COLUMNS,
    calculate_score,
    calculate_score_with_explainability,
    compute_consumer_confusion,
    compute_feature_dominance,
    regional_asymmetry,
    simulate_preference_scenarios,
)
import logging

# ---------- LOGGING SETUP ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.StreamHandler(),              # console
        logging.FileHandler("backend.log")    # file
    ]
)

logger = logging.getLogger(__name__)

# ---------- APP ----------
app = FastAPI(title="App Comparison Backend")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],  # allow POST/GET/etc.
    allow_headers=["*"],
)

# ---------- MODELS ----------

class ValidateRequest(BaseModel):
    appName: str

class CompareApp(BaseModel):
    appName: str
    comparisonMode: str  # FULL or PARTIAL

class CompareRequest(BaseModel):
    apps: List[CompareApp]
    preferences: dict


class Scenario(BaseModel):
    name: str
    preferences: dict


class AnalyticsRequest(BaseModel):
    apps: List[CompareApp]
    preferences: dict
    category: str | None = None
    scenarios: List[Scenario] = []


@app.get("/api/metadata")
def metadata():
    """
    Basic metadata derived from the CSV dataset.
    - categories: unique app categories
    - regions: platforms (or regions if the column exists)
    """
    df = load_dataset()
    if df.empty:
        # Refresh in case dataset changed after initial cache
        load_dataset.cache_clear()
        df = load_dataset()
    categories = []
    if "category" in df.columns:
        cat_series = df["category"].astype(str).str.strip()
        cat_series = cat_series[(cat_series != "") & (~cat_series.isna())]
        categories = sorted(cat_series.unique().tolist())

    region_col = "region" if "region" in df.columns else ("platform" if "platform" in df.columns else None)
    regions = []
    if region_col:
        reg_series = df[region_col].astype(str).str.strip()
        reg_series = reg_series[(reg_series != "") & (~reg_series.isna())]
        regions = sorted(reg_series.unique().tolist())

    # As a fallback, if categories are still empty but df has rows, try reloading once
    if not categories and not df.empty:
        load_dataset.cache_clear()
        df = load_dataset()
        if "category" in df.columns:
            cat_series = df["category"].astype(str).str.strip()
            cat_series = cat_series[(cat_series != "") & (~cat_series.isna())]
            categories = sorted(cat_series.unique().tolist())

    return {"categories": categories, "regions": regions}

# ---------- API 1: VALIDATE APP ----------

@app.post("/api/apps/validate")
def validate_app(req: ValidateRequest):
    logger.info(f"VALIDATE called | appName={req.appName}")

    app_data = get_app_by_name(req.appName)

    if app_data is None:
        logger.info(f"App NOT found in dataset | {req.appName}")
        return {
            "existsInDataset": False,
            "comparisonMode": "PARTIAL"
        }

    logger.info(f"App found in dataset | {req.appName}")
    return {
        "existsInDataset": True,
        "comparisonMode": "FULL"
    }

# ---------- API 2: SEARCH APPS ----------

@app.get("/api/apps/search")
def search(query: str = "", category: str = None):
    logger.info(f"SEARCH called | query='{query}' | category='{category}'")

    results = search_apps(query, category)

    logger.info(f"SEARCH returned {len(results)} results")
    return results

# ---------- API 3: ANALYTICS (FDI, CCS, Scenarios, Explainability, Regional) ----------


@app.post("/api/analytics/insights")
def analytics_insights(req: AnalyticsRequest):
    logger.info("ANALYTICS called")
    requested_names = [a.appName.strip() for a in req.apps]
    selected_app_map = get_apps_by_names(requested_names)

    selected_apps = list(selected_app_map.values())
    if not selected_apps:
        raise HTTPException(status_code=400, detail="No matching apps found in dataset")

    df = load_dataset()
    # Cohort dataframe limited to selected apps for FDI/CCS
    cohort_df = df[df["app_name"].str.lower().isin({name.lower() for name in requested_names})]

    fdi = compute_feature_dominance(cohort_df, FEATURE_COLUMNS, req.preferences)
    ccs = compute_consumer_confusion(cohort_df, FEATURE_COLUMNS)
    scenarios = [
        {"name": "BaseUserInput", "preferences": req.preferences},
        *[{ "name": s.name, "preferences": s.preferences } for s in req.scenarios],
    ]
    scenario_results = simulate_preference_scenarios(selected_apps, scenarios)

    explainability = []
    for app in selected_apps:
        score, breakdown = calculate_score_with_explainability(app, req.preferences)
        explainability.append({"app": app.get("app_name"), "score": score, "breakdown": breakdown})

    regional = regional_asymmetry(df, req.category, req.preferences)

    return {
        "fdi": fdi,
        "consumerConfusion": ccs,
        "scenarios": scenario_results,
        "explainability": explainability,
        "regionalAsymmetry": regional,
    }

# ---------- API 3: COMPARE APPS ----------

@app.post("/api/compare")
def compare_apps(req: CompareRequest):
    logger.info("COMPARE called")
    logger.info(f"Apps received: {[a.appName for a in req.apps]}")
    logger.info(f"Preferences: {req.preferences}")

    results = []
    requested_names = [a.appName.strip() for a in req.apps]
    selected_app_map = get_apps_by_names(requested_names)

    for app_req in req.apps:
        logger.info(
            f"Processing app | name={app_req.appName} | mode={app_req.comparisonMode}"
        )

        normalized_name = app_req.appName.strip().lower()
        app_data = selected_app_map.get(normalized_name)

        if app_req.comparisonMode == "FULL" and app_data is None:
            logger.error(
                f"FULL comparison requested but app not found: {app_req.appName}"
            )
            raise HTTPException(
                status_code=400,
                detail=f"{app_req.appName} not available for full comparison"
            )

        # PARTIAL comparison placeholder
        if app_req.comparisonMode == "PARTIAL" and app_data is None:
            logger.warning(
                f"PARTIAL comparison | external app used: {app_req.appName}"
            )
            app_data = {
                "rating": 3.5,
                "price_inr": 0,
                "feature_richness_score": 0,
                "ease_of_use_score": 0,
                "performance_score": 0,
                "service_breadth_score": 0
            }

        score = calculate_score(
            app_data,
            req.preferences,
            app_req.comparisonMode
        )

        logger.info(
            f"Score calculated | app={app_req.appName} | score={score}"
        )

        results.append({
            "app": app_req.appName,
            "mode": app_req.comparisonMode,
            "score": score
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    logger.info(f"Winner selected: {results[0]['app']}")

    return {
        "winner": results[0],
        "results": results
    }
