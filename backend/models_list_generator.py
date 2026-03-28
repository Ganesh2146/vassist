import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GOOGLE_GEMINI_API_KEY'))

models_list = []
for m in genai.list_models():
    models_list.append({
        'name': m.name,
        'methods': m.supported_generation_methods
    })

with open('models_list.json', 'w') as f:
    json.dump(models_list, f, indent=2)
