# Intelligent App Selection System

## Overview
The "Browse Available Apps" section now uses Gemini API as an intermediate reasoning layer to intelligently select and rank applications based on real-world usage, popularity, and quality metrics.

## Architecture

```
Frontend → Backend API → Gemini API → Ranked Dataset → Frontend
```

**Gemini acts as a semantic decision-maker**, not just a data fetcher.

## How It Works

### 1. Data Preparation
- Filters dataset by category (if specified)
- Pre-filters low-quality apps (rating < 3.5, low MAU, etc.)
- Prepares structured JSON with app metadata

### 2. Gemini Analysis
Gemini receives:
- Complete app dataset with MAU, ratings, platforms, domains
- Selection criteria emphasizing:
  - High MAU and global adoption
  - Brand recognition and trust
  - Cross-platform availability
  - Domain balance

### 3. Intelligent Selection
Gemini eliminates:
- Dummy/placeholder apps
- Low-adoption apps
- Redundant apps in same domain
- Experimental/niche apps

### 4. Response Format
Returns structured JSON:
```json
{
  "selected_apps": [
    {
      "app_name": "WhatsApp",
      "domain": "Communication",
      "reason": "Highest global adoption and daily usage",
      "rank": 1
    }
  ]
}
```

## API Endpoint

### GET `/api/apps/search`

**Parameters:**
- `query` (optional): Search query string
- `category` (optional): Filter by category
- `use_intelligent_selection` (default: true): Enable Gemini-based selection

**Response:**
Apps with additional fields:
- `ai_reason`: Gemini's justification for selection
- `ai_rank`: Ranking assigned by Gemini
- `selection_method`: "gemini" or "traditional"

## Fallback Mechanism

If Gemini API is unavailable or fails:
- Falls back to rule-based composite scoring
- Uses: Rating (40%) + MAU (40%) + Global Rank (20%)
- Still provides high-quality results

## Configuration

### API Key
Set via environment variable:
```bash
export GEMINI_API_KEY="your-api-key"
```

Or configured in `main.py` as fallback.

## Frontend Integration

The frontend displays:
- **AI-Selected badge**: Shows when apps are selected by Gemini
- **Rank badges**: Shows Gemini's ranking (#1, #2, etc.)
- **AI Reason**: Displays Gemini's justification for each app

## Benefits

1. **Quality Assurance**: Only well-known, trusted apps appear
2. **Domain Balance**: Ensures diverse app categories
3. **Real-World Relevance**: Prioritizes actual usage over raw metrics
4. **Adaptive**: Can adapt to new trends and apps
5. **Transparent**: Shows reasoning for each selection

## Example Selection Criteria

Gemini prioritizes:
- ✅ WhatsApp (2400M MAU, global adoption)
- ✅ Google Search (5000M MAU, dominant)
- ✅ YouTube (2500M MAU, cross-platform)
- ❌ Test apps or low-adoption apps
- ❌ Redundant apps in same domain

## Testing

To test the intelligent selection:
1. Call `/api/apps/search?category=Messaging`
2. Check `selection_method` field in response
3. Verify `ai_reason` provides meaningful justifications
4. Confirm only high-quality apps are returned

## Performance

- **Gemini API**: ~2-3 seconds per request
- **Fallback**: <100ms
- **Caching**: Consider adding caching for frequently accessed categories

## Future Enhancements

1. Cache Gemini responses for common queries
2. Add user preference learning
3. Support multi-domain queries
4. A/B testing between Gemini and traditional selection

