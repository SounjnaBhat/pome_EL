from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from data_loader import get_app_by_name, get_apps_by_names, load_dataset, search_apps
from intelligent_app_selector import intelligent_app_selection
from comparison import (
    FEATURE_COLUMNS,
    calculate_score,
    calculate_score_with_explainability,
    calculate_popularity_score,
    compute_consumer_confusion,
    compute_feature_dominance,
    generate_ai_overview,
    generate_detailed_app_comparison,
    get_graph_ready_outputs,
    regional_asymmetry,
    simulate_preference_scenarios,
)
import logging
import os

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

# ---------- API 2: SEARCH APPS (Intelligent Selection) ----------

@app.get("/api/apps/search")
def search(query: str = "", category: str = None, use_intelligent_selection: bool = True):
    """
    Search apps with intelligent Gemini-based selection.
    
    Args:
        query: Search query string (optional)
        category: Filter by category (optional)
        use_intelligent_selection: Use Gemini AI for intelligent app selection (default: True)
    """
    logger.info(f"SEARCH called | query='{query}' | category='{category}' | intelligent={use_intelligent_selection}")

    df = load_dataset()
    
    # If query provided, filter first
    if query:
        df = df[df["app_name"].str.contains(query, case=False, na=False)]
    
    # Use intelligent selection if enabled
    if use_intelligent_selection:
        gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAUNB-bZi2Xp4Ss6AIxYtXCcboYRDM13jU")
        logger.info(f"Using intelligent selection with Gemini API (category: {category})")
        selection_result = intelligent_app_selection(df, category=category, query=query, limit=20, api_key=gemini_api_key)
        
        logger.info(f"Selection result: method={selection_result.get('method')}, apps_count={len(selection_result.get('selected_apps', []))}")
        
        if selection_result["method"] == "gemini" and selection_result["selected_apps"]:
            # Get full app data for selected apps
            selected_names = [app["app_name"] for app in selection_result["selected_apps"]]
            logger.info(f"Gemini selected apps: {selected_names[:5]}...")  # Log first 5
            selected_map = get_apps_by_names(selected_names)
            
            # Build results maintaining Gemini's ranking
            results = []
            for app_info in selection_result["selected_apps"]:
                app_name = app_info["app_name"]
                app_data = selected_map.get(app_name.lower())
                if app_data:
                    # Add Gemini's reason and rank
                    app_data["ai_reason"] = app_info.get("reason", "")
                    app_data["ai_rank"] = app_info.get("rank", 0)
                    app_data["selection_method"] = "gemini"
                    results.append(app_data)
                else:
                    logger.warning(f"App '{app_name}' selected by Gemini but not found in dataset")
            
            logger.info(f"✅ Gemini intelligent selection returned {len(results)} apps")
            if results:
                logger.info(f"Top 3 apps: {[r['app_name'] for r in results[:3]]}")
            return results
        else:
            logger.warning(f"⚠️ Gemini selection failed or returned empty. Method: {selection_result.get('method')}, Error: {selection_result.get('error', 'None')}")
    
    # Fallback to traditional search
    results = search_apps(query, category)
    
    # Add selection method indicator
    for result in results:
        result["selection_method"] = "traditional"
    
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

    # CRITICAL: Pass selected_app_names to all analytics functions
    fdi = compute_feature_dominance(cohort_df, FEATURE_COLUMNS, req.preferences, selected_app_names=requested_names)
    ccs = compute_consumer_confusion(cohort_df, FEATURE_COLUMNS)
    scenarios = [
        {"name": "BaseUserInput", "preferences": req.preferences},
        *[{ "name": s.name, "preferences": s.preferences } for s in req.scenarios],
    ]
    scenario_results = simulate_preference_scenarios(selected_apps, scenarios, selected_app_names=requested_names)

    explainability = []
    # Guard: Only include selected apps in explainability
    selected_normalized = {name.lower() for name in requested_names}
    for app in selected_apps:
        app_name = app.get("app_name", "")
        if app_name.lower() not in selected_normalized:
            continue
        score, breakdown = calculate_score_with_explainability(app, req.preferences)
        explainability.append({"app": app_name, "score": score, "breakdown": breakdown})

    # CRITICAL: Pass selected apps to regional_asymmetry
    regional = regional_asymmetry(cohort_df, req.category, req.preferences, selected_app_names=requested_names)

    # Generate AI Overview
    ai_overview = ""
    if explainability:
        # Sort explainability the same way as frontend: by score, then by popularity for ties
        # This ensures AI Overview matches the Personalized Recommendation
        for e in explainability:
            app_name = e.get("app", "")
            app_data = selected_app_map.get(app_name.lower())
            if app_data:
                # Calculate popularity score for tiebreaking
                popularity = calculate_popularity_score(app_data, req.category)
                e["popularity"] = popularity
        
        # Sort: score (descending), then popularity (descending) for tiebreaking
        # This matches frontend logic: if scores are within 0.1, use popularity
        sorted_explainability = sorted(
            explainability,
            key=lambda x: (x.get("score", 0), x.get("popularity", 0)),
            reverse=True
        )
        
        # For very close scores (within 0.1), re-sort by popularity
        if len(sorted_explainability) > 1:
            top_score = sorted_explainability[0].get("score", 0)
            # Group apps with scores within 0.1 of top score
            top_group = [e for e in sorted_explainability if abs(e.get("score", 0) - top_score) < 0.1]
            if len(top_group) > 1:
                # Re-sort top group by popularity (descending)
                top_group.sort(key=lambda x: x.get("popularity", 0), reverse=True)
                # Rebuild sorted list: top group (sorted by popularity) + rest (sorted by score)
                rest_group = [e for e in sorted_explainability if abs(e.get("score", 0) - top_score) >= 0.1]
                sorted_explainability = top_group + rest_group
        
        # Winner is the first item after sorting (matches frontend's scoredApps[0])
        winner_explain = sorted_explainability[0]
        winner_app = None
        for app in selected_apps:
            if app.get("app_name", "").lower() == winner_explain.get("app", "").lower():
                winner_app = app
                break
        
        if winner_app:
            all_scores = [{"app": e.get("app"), "score": e.get("score", 0)} for e in sorted_explainability]
            # Use Gemini API key from environment variable or fallback to provided key
            gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAUNB-bZi2Xp4Ss6AIxYtXCcboYRDM13jU")
            ai_overview = generate_ai_overview(
                winner_app,
                winner_explain.get("score", 0),
                winner_explain.get("breakdown", []),
                all_scores,
                req.preferences,
                api_key=gemini_api_key
            )
    
    # Generate detailed app comparisons (Gemini-powered insights for each app)
    detailed_comparisons = {}
    if explainability:
        gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAUNB-bZi2Xp4Ss6AIxYtXCcboYRDM13jU")
        for e in explainability:
            app_name = e.get("app", "")
            app_data = selected_app_map.get(app_name.lower())
            if app_data:
                detailed_insight = generate_detailed_app_comparison(
                    app_data,
                    e.get("score", 0),
                    e.get("breakdown", []),
                    selected_apps,
                    [{"app": ex.get("app"), "score": ex.get("score", 0)} for ex in explainability],
                    req.preferences,
                    api_key=gemini_api_key
                )
                detailed_comparisons[app_name] = detailed_insight
    
    # Generate graph-ready outputs
    graph_outputs = get_graph_ready_outputs(
        selected_app_map,  # Pass the full map of app data
        explainability,
        fdi,
        ccs,
        req.category
    )

    return {
        "fdi": fdi,
        "consumerConfusion": ccs,
        "scenarios": scenario_results,
        "explainability": explainability,
        "regionalAsymmetry": regional,
        "aiOverview": ai_overview,
        "graphOutputs": graph_outputs,
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
        
        # Calculate popularity score
        # Try to get category from app_data, but handle case where it might not exist
        category = None
        if app_data:
            category = app_data.get("category") or app_data.get("Category")
        popularity = calculate_popularity_score(app_data if app_data else {}, category)

        logger.info(
            f"Score calculated | app={app_req.appName} | score={score} | popularity={popularity}"
        )

        results.append({
            "app": app_req.appName,
            "mode": app_req.comparisonMode,
            "score": score,
            "popularity": popularity
        })

    # Guard: Ensure all results are from requested apps
    requested_normalized = {name.lower() for name in requested_names}
    results = [r for r in results if r["app"].lower() in requested_normalized]

    if not results:
        raise HTTPException(status_code=400, detail="No valid results after filtering")

    # Primary sort: by score (descending)
    # Secondary sort: by popularity (descending) - for apps with similar scores
    results.sort(key=lambda x: (x["score"], x.get("popularity", 0)), reverse=True)

    logger.info(f"Winner selected: {results[0]['app']}")

    return {
        "winner": results[0],
        "results": results
    }
