# Feature Locations - AI Overview & Graphs

## 1. AI Overview Display Location

### Frontend Location:
**File:** `frontend/src/pages/ComparisonTool.tsx`
**Lines:** 760-765

**Location in UI:**
- Section: "Personalized Recommendation" (Green banner section)
- Position: Below the main recommendation text
- Display: Shows when `analytics?.aiOverview` is available

**Code:**
```tsx
{analytics?.aiOverview && (
  <div className="mt-6 pt-6 border-t border-green-500">
    <h3 className="text-xl font-semibold mb-3">AI Overview</h3>
    <p className="text-base text-green-50 leading-relaxed">{analytics.aiOverview}</p>
  </div>
)}
```

**Backend Generation:**
- **File:** `backend/comparison.py`
- **Function:** `generate_ai_overview()` (lines 298-355)
- **API Endpoint:** `/api/analytics/insights` in `backend/main.py` (lines 180-199)
- **Uses:** Gemini API to generate intelligent explanations

---

## 2. Graph-Ready Outputs Display Location

### Frontend Location:
**File:** `frontend/src/pages/ComparisonTool.tsx`
**Lines:** 1020-1106

**Location in UI:**
- Section: "Graph-Ready Outputs (Academic Figures)"
- Position: After Feature Contributions table, before Regional Asymmetry
- Display: Shows when `analytics?.graphOutputs` is available

**What's Displayed:**
1. **Feature Contribution Breakdown** (Table)
   - Shows percentage contribution of each feature per app
   - Format: App name → Feature percentages

2. **Dominance vs Popularity** (Table)
   - Shows dominance index and popularity score for each app
   - Format: App name, Dominance Index, Popularity Score

3. **Confusion Score by Category** (Table)
   - Shows confusion score per category
   - Format: Category name, Confusion Score

**Backend Generation:**
- **File:** `backend/comparison.py`
- **Function:** `get_graph_ready_outputs()` (lines 357-424)
- **API Endpoint:** `/api/analytics/insights` in `backend/main.py` (lines 201-208)

---

## 3. Visual Graphs (PNG/PDF Files)

### Generated Graph Files:
**Location:** `backend/data/graphs/` (if generated)

**Files Created:**
- `top_50_apps_comparison.png/pdf` - Top 50 apps by MAU
- `top_20_apps_comparison.png/pdf` - Top 20 apps by MAU
- `category_comparison.png/pdf` - Average MAU by category

**Generation Script:**
- **File:** `backend/generate_popularity_graph.py` (was created but may have been deleted)
- **Status:** Graphs are generated but NOT displayed in UI (only data tables are shown)

---

## Summary

✅ **AI Overview:** Already displayed in UI (Personalized Recommendation section)
✅ **Graph Data Tables:** Already displayed in UI (Graph-Ready Outputs section)
❌ **Visual Graphs:** Generated but NOT displayed in UI (only available as files)

---

## Recommendations

If you want to display the visual graphs in the UI:
1. Serve graph images from backend static files
2. Add image display components in frontend
3. Or regenerate graphs on-demand and display them

