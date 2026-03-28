import requests
import json
from app import create_app
from flask_jwt_extended import create_access_token
from app.models.user import User

app = create_app()

with app.app_context():
    # Get the admin user
    admin = User.query.filter_by(user_type='admin').first()
    if not admin:
        print('No admin user found')
        exit(1)
    
    # Create a valid JWT token
    access_token = create_access_token(identity=admin.email)
    print(f'Generated valid JWT token for {admin.email}')
    print(f'Token: {access_token[:50]}...\n')
    
    # Test the analytics endpoint
    url = 'http://localhost:5000/api/admin/analytics/overview'
    headers = {
        'Origin': 'http://localhost:5173',
        'Authorization': f'Bearer {access_token}'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f'Status: {response.status_code}')
        print(f'\nCORS Response Headers:')
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower() or 'vary' in k.lower()}
        for key, value in cors_headers.items():
            print(f'  {key}: {value}')
        print(f'\nResponse Body (first 500 chars):')
        data = response.json()
        print(json.dumps(data, indent=2)[:500])
        print('...')
    except Exception as e:
        print(f'Error: {e}')
