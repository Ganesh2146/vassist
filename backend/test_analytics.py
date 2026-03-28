import requests
import json

# Test the analytics endpoint
url = 'http://localhost:5000/api/admin/analytics/overview'
headers = {
    'Origin': 'http://localhost:5173',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImphdGkiOiIwYWI0MzE0ZC0xYTA2LTRmOTAtYTdkOC05MGMzMDhjNTdjYzMiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoiYWRtaW5AdW5pdmVyc2l0eS5lZHUiLCJuYmYiOjE3NDUyNzI3NzcsImlhdCI6MTc0NTI3Mjc3N30.3Csc_bpQSTH1NNE1T85nWTDRvzb1R0j1jWJBTGfAflU'
}

try:
    response = requests.get(url, headers=headers)
    print(f'Status: {response.status_code}')
    print(f'\nCORS Response Headers:')
    cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower() or 'vary' in k.lower()}
    if cors_headers:
        for key, value in cors_headers.items():
            print(f'  {key}: {value}')
    else:
        print('  NO CORS HEADERS FOUND!')
    print(f'\nResponse Body:')
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(response.text)
except Exception as e:
    print(f'Error: {e}')
