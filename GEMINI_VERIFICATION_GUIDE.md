# Gemini-Powered App Selection Verification Guide

## How to Verify Gemini is Working

### 1. Check Backend Logs

When you load apps, check the backend console/logs for:

```
INFO: SEARCH called | query='' | category='Messaging' | intelligent=True
INFO: Using intelligent selection with Gemini API (category: Messaging)
INFO: Attempting Gemini API call for category: Messaging, query: None, apps: XX
INFO: Sending prompt to Gemini API...
INFO: ✅ Gemini API response received (length: XXX chars)
INFO: ✅ Gemini selected X apps intelligently (category: Messaging)
INFO: Selection result: method=gemini, apps_count=X
INFO: Gemini selected apps: ['WhatsApp', 'Telegram', 'Signal', ...]
INFO: ✅ Gemini intelligent selection returned X apps
```

**If you see "method=fallback" instead of "method=gemini"**, Gemini is not working.

### 2. Check Frontend Console

Open browser DevTools (F12) and check Console tab. You should see:

```
Loading apps with Gemini intelligent selection for category: Messaging
Apps loaded: 20 total | 20 Gemini-selected | 0 Traditional
Gemini-selected apps: ['WhatsApp', 'Telegram', 'Signal', ...]
```

### 3. Check UI Badge

In the "Browse Available Apps" section, you should see:
- **"Gemini AI-Selected"** badge (blue, with pulsing dot) if Gemini is working
- **"Traditional Sorting"** badge (gray) if fallback is being used

### 4. Verify App Order

For **Messaging/Communication** category, you should see:
- ✅ WhatsApp (rank #1)
- ✅ Telegram (rank #2)
- ✅ Signal (rank #3)
- ✅ Discord, Messenger, etc.

**NOT:**
- ❌ BS-Mobile
- ❌ BV
- ❌ CB Browser
- ❌ EJ Messenger

### 5. Run Test Script

Run the test script to verify Gemini directly:

```bash
cd backend
python test_gemini_selection.py
```

Expected output:
```
Testing Gemini-Powered App Selection
============================================================

1. Loading dataset...
   ✓ Dataset loaded: 9742 apps

2. Testing selection for category: Messaging
   ✓ API key configured: AIzaSyAUNB-bZi2Xp4Ss...

3. Calling Gemini API for intelligent selection...
   ✓ Gemini API response received

4. Selection Results:
   Method: gemini
   Apps selected: 10

5. Selected Apps (Top 10):
   #1 WhatsApp
      Reason: Most widely used messaging app globally
   #2 Telegram
      Reason: High adoption with strong privacy features
   ...

6. Verification:
   Expected apps: ['WhatsApp', 'Telegram', 'Signal', 'Discord', 'Messenger']
   Found: ['WhatsApp', 'Telegram', 'Signal', 'Discord']
   ✅ PASS: Found major messaging apps
```

## Troubleshooting

### If Gemini is NOT Working:

1. **Check API Key:**
   - Verify `GEMINI_API_KEY` environment variable
   - Or check hardcoded key in `main.py` line 154

2. **Check Package Installation:**
   ```bash
   pip install google-generativeai
   ```

3. **Check Logs for Errors:**
   - Look for "Gemini API call failed" messages
   - Check for JSON parsing errors
   - Verify network connectivity

4. **Verify Dataset:**
   - Ensure apps like WhatsApp, Telegram exist in dataset
   - Check category names match (e.g., "Messaging" vs "Communication")

### Common Issues:

1. **"method=fallback" in logs:**
   - Gemini API call failed
   - Check API key validity
   - Check internet connection
   - Review error logs

2. **Still seeing dummy apps:**
   - Gemini might be returning them (check Gemini response)
   - Fallback might be active (check logs)
   - Dataset might have incorrect category names

3. **No apps returned:**
   - Check category name matches dataset
   - Verify dataset has apps in that category
   - Check filtering logic

## Expected Behavior

### ✅ Working Correctly:
- Backend logs show "method=gemini"
- Frontend shows "Gemini AI-Selected" badge
- Apps are ordered: WhatsApp → Telegram → Signal
- No dummy/unknown apps in top results
- Each app has `ai_reason` field

### ❌ Not Working:
- Backend logs show "method=fallback"
- Frontend shows "Traditional Sorting" badge
- Apps ordered by rating (unknown apps first)
- Dummy apps like "BS-Mobile" appear
- No `ai_reason` field in app data

## Quick Fix Commands

```bash
# Test Gemini directly
cd backend
python test_gemini_selection.py

# Check if package is installed
pip show google-generativeai

# Check backend logs
tail -f backend/backend.log

# Restart backend
# (Stop current server, then restart)
```

