# Gemini AI Integration

## Overview
The AI Overview feature now uses Google's Gemini API to generate natural language explanations of app recommendations.

## Features
- **AI-Powered Explanations**: Uses Gemini Pro model to generate intelligent, context-aware explanations
- **Fallback Mechanism**: If API call fails, automatically falls back to template-based explanation
- **Structured Input**: Provides structured analytics data (feature contributions, preferences, comparisons) to the AI

## API Key Configuration

### Option 1: Environment Variable (Recommended)
Set the API key as an environment variable:
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# Windows CMD
set GEMINI_API_KEY=your-api-key-here

# Linux/Mac
export GEMINI_API_KEY="your-api-key-here"
```

### Option 2: Direct Configuration
The API key is currently set in `main.py` as a fallback. For production, use environment variables.

## How It Works

1. When generating AI overview, the system:
   - Collects structured data (winner app, scores, feature breakdown, preferences, competitors)
   - Builds a detailed prompt for Gemini
   - Calls Gemini API to generate explanation
   - Falls back to template if API fails

2. The AI receives:
   - Winner app name and score
   - Top contributing features with weights and contributions
   - User preference weights
   - Competitor comparisons

3. The AI generates:
   - Clear explanation of why the app scored highest
   - Specific mention of driving features
   - Comparison with alternatives

## Testing

To test the integration:
1. Ensure `google-generativeai` package is installed: `pip install google-generativeai`
2. Set the API key (see above)
3. Run the backend and make a comparison request
4. Check the "AI Overview" section in the response

## Notes

- The API key provided has been integrated
- For security, consider moving the key to environment variables in production
- The system gracefully handles API failures with fallback explanations

