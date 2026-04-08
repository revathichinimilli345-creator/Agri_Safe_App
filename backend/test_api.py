import urllib.request
import json

def test_prediction(payload, description):
    print(f"\n--- Testing: {description} ---")
    url = "http://localhost:8000/api/predict/"
    headers = {'Content-Type': 'application/json'}
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            print(f"Status: {response.status_code if hasattr(response, 'status_code') else response.getcode()}")
            print(json.dumps(json.loads(res_body), indent=2))
    except Exception as e:
        print(f"Error: {e}")

# Case 1: Suitable Land (Punjab-like conditions)
suitable_payload = {
    "temperature": 25.0,
    "rainfall": 150.0,
    "nitrogen": 90.0,
    "phosphorus": 45.0,
    "potassium": 42.0,
    "ph": 6.8,
    "soil_type": "Alluvial",
    "state": "Punjab",
    "humidity": 65.0
}

# Case 2: Unsuitable Land (Extreme pH)
unsuitable_payload = {
    "temperature": 25.0,
    "rainfall": 150.0,
    "nitrogen": 90.0,
    "phosphorus": 45.0,
    "potassium": 42.0,
    "ph": 4.5,
    "soil_type": "Alluvial",
    "state": "Punjab",
    "humidity": 65.0
}

if __name__ == "__main__":
    test_prediction(suitable_payload, "Suitable Land")
    test_prediction(unsuitable_payload, "Unsuitable Land (Extreme pH)")
