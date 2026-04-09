import urllib.request
import urllib.error
import json

BASE_URL = "http://localhost:8000/api"

def debug_login():
    print(f"Targeting: {BASE_URL}")
    
    # 1. Login
    login_url = f"{BASE_URL}/auth/login"
    payload = {"email": "admin@jdgkbsi.ph", "password": "JdgkAdmin2026!"}
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(login_url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        print("Attempting Login...")
        with urllib.request.urlopen(req) as response:
            print(f"Login Status: {response.status}")
            body = response.read().decode('utf-8')
            print(f"Login Response: {body[:100]}...")
            
            resp_json = json.loads(body)
            # Handle SessionResponse or direct TokenResponse structure
            print("Login Response Details:")
            print(json.dumps(resp_json.get("session", {}).get("user", {}), indent=2))
            
            session = resp_json.get('session')
            if session:
                token = session.get('access_token')
            else:
                token = resp_json.get('access_token') # fallback
                
            print(f"Got Token: {token[:10]}...")
            return token
    except urllib.error.HTTPError as e:
        print(f"Login Failed: {e.code} - {e.reason}")
        print(f"Error Body: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"Login Error: {e}")
        return None

def debug_settings(token):
    if not token:
        return

    # 2. Get Settings
    settings_url = f"{BASE_URL}/settings"
    req = urllib.request.Request(settings_url, method='GET')
    req.add_header('Authorization', f"Bearer {token}")
    
    try:
        print("\nAttempting GET /settings...")
        with urllib.request.urlopen(req) as response:
            print(f"Settings Status: {response.status}")
            body = response.read().decode('utf-8')
            print(f"Settings Response: {body[:100]}...")
    except urllib.error.HTTPError as e:
        print(f"Settings Failed: {e.code} - {e.reason}")
        print(f"Error Body: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Settings Error: {e}")

if __name__ == "__main__":
    token = debug_login()
    if token:
        debug_settings(token)
