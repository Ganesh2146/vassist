import requests

# 1. Login
response = requests.post("http://127.0.0.1:5000/api/auth/login", json={"email":"admin@university.edu", "password":"Admin@123"})
data = response.json()
token = data["data"]["access_token"]
print("Token:", token[:30] + "...")

# 2. Check Timetable status
headers = {"Authorization": f"Bearer {token}"}
status_response = requests.get("http://127.0.0.1:5000/api/admin/timetable/status", headers=headers)
print("Status Response:", status_response.status_code, status_response.text)
