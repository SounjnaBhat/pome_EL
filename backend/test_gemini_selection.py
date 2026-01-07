"""
Test script to verify Gemini-powered app selection is working.
Run this to check if Gemini is properly selecting apps.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from data_loader import load_dataset
from intelligent_app_selector import intelligent_app_selection

def test_gemini_selection():
    """Test Gemini selection for Communication category."""
    print("=" * 60)
    print("Testing Gemini-Powered App Selection")
    print("=" * 60)
    
    # Load dataset
    print("\n1. Loading dataset...")
    df = load_dataset()
    print(f"   ✓ Dataset loaded: {len(df)} apps")
    
    # Test Communication category
    category = "Messaging"  # or "Communication"
    print(f"\n2. Testing selection for category: {category}")
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY", "AIzaSyAUNB-bZi2Xp4Ss6AIxYtXCcboYRDM13jU")
    print(f"   ✓ API key configured: {api_key[:20]}...")
    
    # Call intelligent selection
    print(f"\n3. Calling Gemini API for intelligent selection...")
    result = intelligent_app_selection(
        df, 
        category=category, 
        query=None, 
        limit=10, 
        api_key=api_key
    )
    
    # Display results
    print(f"\n4. Selection Results:")
    print(f"   Method: {result.get('method', 'unknown')}")
    print(f"   Apps selected: {len(result.get('selected_apps', []))}")
    
    if result.get('error'):
        print(f"   ⚠️  Error: {result.get('error')}")
    
    if result.get('selected_apps'):
        print(f"\n5. Selected Apps (Top 10):")
        print("-" * 60)
        for app in result['selected_apps'][:10]:
            print(f"   #{app.get('rank', '?')} {app.get('app_name', 'Unknown')}")
            print(f"      Reason: {app.get('reason', 'No reason provided')}")
            print()
    else:
        print("   ⚠️  No apps selected!")
    
    # Verify expected apps for Communication/Messaging
    if category in ["Messaging", "Communication"]:
        expected_apps = ["WhatsApp", "Telegram", "Signal", "Discord", "Messenger"]
        selected_names = [app['app_name'] for app in result.get('selected_apps', [])]
        found_expected = [name for name in expected_apps if name in selected_names]
        
        print(f"\n6. Verification:")
        print(f"   Expected apps: {expected_apps}")
        print(f"   Found: {found_expected}")
        
        if len(found_expected) >= 3:
            print("   ✅ PASS: Found major messaging apps")
        else:
            print("   ⚠️  WARNING: Major messaging apps not found in top results")
    
    print("\n" + "=" * 60)
    return result

if __name__ == "__main__":
    test_gemini_selection()

