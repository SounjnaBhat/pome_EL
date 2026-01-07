# Quick Verification Steps

## To Verify Gemini is Working:

1. **Check Backend Logs** - Look for:
   ```
   INFO: Using intelligent selection with Gemini API (category: Communication)
   INFO: Attempting Gemini API call for category: Communication
   INFO: ✅ Gemini API response received
   INFO: ✅ Gemini intelligent selection returned X apps
   ```

2. **Check Frontend Console (F12)** - Should show:
   ```
   Loading apps with Gemini intelligent selection for category: Communication
   Apps loaded: 20 total | 20 Gemini-selected | 0 Traditional
   Gemini-selected apps: ['WhatsApp', 'Telegram', 'Signal', ...]
   ```

3. **Check UI Badge** - Should show "Gemini AI-Selected" (blue badge)

4. **Verify App Order** - For Communication category:
   - ✅ WhatsApp should be #1
   - ✅ Telegram should be #2
   - ✅ Signal should be #3
   - ❌ NO BS-Mobile, BV, CB Browser, EJ Messenger

## If Still Not Working:

1. **Check if Gemini is being called:**
   - Look for "method=gemini" in logs (not "method=fallback")

2. **Check category matching:**
   - Dataset uses "Messaging" category
   - Code now maps "Communication" → "Messaging"
   - Check logs for: "Filtered to X apps for category 'Communication' (matched: ['Messaging', 'Communication'])"

3. **Test directly:**
   ```bash
   cd backend
   python test_gemini_selection.py
   ```

4. **Check API key:**
   - Verify in `main.py` line 154
   - Or set `GEMINI_API_KEY` environment variable

