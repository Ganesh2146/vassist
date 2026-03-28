import requests
import json
from app import create_app
from flask_jwt_extended import create_access_token
from app.models.user import User

app = create_app()

with app.app_context():
    admin = User.query.filter_by(user_type='admin').first()
    access_token = create_access_token(identity=admin.email)
    
    endpoints = [
        '/api/admin/analytics/overview',
        '/api/admin/analytics/users?period=30days',
        '/api/admin/analytics/chat?period=30days',
        '/api/admin/analytics/care?period=30days',
        '/api/admin/users/breakdown',
        '/api/admin/system-health',
    ]
    
    headers = {
        'Origin': 'http://localhost:5173',
        'Authorization': f'Bearer {access_token}'
    }
    
    print("Testing all analytics endpoints:\n")
    for endpoint in endpoints:
        url = f'http://localhost:5000{endpoint}'
        try:
            response = requests.get(url, headers=headers)
            status = '✓' if response.status_code == 200 else '✗'
            print(f'{status} {endpoint}: {response.status_code}')
            if response.status_code != 200:
                print(f'  Error: {response.text[:100]}')
        except Exception as e:
            print(f'✗ {endpoint}: Error - {e}')
    
    print("\nAll tests completed!")
