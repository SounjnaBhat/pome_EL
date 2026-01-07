# Dataset Update Summary

## Overview
The dataset has been updated to include the top 100 globally popular applications ranked by Monthly Active Users (MAU).

## Changes Made

### New Columns Added
1. **global_rank** (integer): Global popularity rank (1-100, where 1 = most popular)
2. **mau_millions** (float): Monthly Active Users in millions
3. **platforms** (string): Platform availability (e.g., "Android, iOS, Web")
4. **primary_use** (string): Primary use case description

### Data Statistics
- **Total apps in dataset**: 9,742 (was 9,712)
- **Apps with global rankings**: 120
- **New apps added**: 30 popular apps that weren't in the original dataset
- **Existing apps updated**: 90 apps received popularity data updates

### Top 10 Apps by Global Rank
1. Google Search - 5,000M MAU
2. YouTube - 2,500M MAU
3. WhatsApp - 2,400M MAU
4. Facebook - 3,000M MAU
5. Instagram - 2,000M MAU
6. TikTok - 1,600M MAU
7. Gmail - 1,800M MAU
8. Google Maps - 1,500M MAU
9. Google Drive - 1,000M MAU
10. Amazon Shopping - 1,500M MAU

### MAU Distribution
- **Maximum MAU**: 5,000M (Google Search)
- **Minimum MAU**: 30M (Clubhouse)
- **Categories covered**: 25+ domains including Communication, Social Media, Search, Video, Cloud Storage, E-Commerce, Finance, Travel, Entertainment, etc.

## Files Generated

### Dataset Files
- **apps_master_dataset_updated.csv**: Updated dataset with popularity rankings
- **apps_master_dataset.csv**: Original dataset (preserved)

### Graph Files (Publication Quality)
All graphs are available in both PNG (300 DPI) and PDF formats:

1. **top_50_apps_comparison.png/pdf**: 
   - Bar chart comparing top 50 apps by MAU
   - Color-coded by domain/category
   - Includes rank labels and MAU values

2. **top_20_apps_comparison.png/pdf**:
   - Focused view of top 20 most popular apps
   - Suitable for detailed analysis

3. **category_comparison.png/pdf**:
   - Average MAU by application category
   - Helps identify dominant categories

## Usage

### To Use the Updated Dataset
The updated dataset is saved as `apps_master_dataset_updated.csv`. To make it the default:

```python
# Option 1: Update data_loader.py to use the new file
DATA_PATH = Path(__file__).parent / "data" / "apps_master_dataset_updated.csv"

# Option 2: Rename the files
# Rename apps_master_dataset.csv to apps_master_dataset_backup.csv
# Rename apps_master_dataset_updated.csv to apps_master_dataset.csv
```

### To Regenerate Graphs
```bash
cd backend
python generate_popularity_graph.py
```

### To Update Dataset Again
```bash
cd backend
python update_popular_apps_dataset.py
```

## Dataset Structure

The updated dataset maintains all original columns plus:
- `global_rank`: Integer (1-100)
- `mau_millions`: Float (Monthly Active Users)
- `platforms`: String (comma-separated platform list)
- `primary_use`: String (brief description)

## Notes

- Apps are sorted by `global_rank` (ascending), so most popular apps appear first
- Apps without global rankings retain NULL values in the new columns
- The dataset is backward compatible - existing functionality works with NULL values
- Duplicate app names were removed (first occurrence kept)

## Next Steps

1. Review the generated graphs in `backend/data/graphs/`
2. Consider updating `data_loader.py` to use the updated dataset
3. Update frontend to display MAU and rank information if desired
4. Use the popularity data for improved ranking in the comparison tool

