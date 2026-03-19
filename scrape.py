from duckduckgo_search import DDGS
import json

doctors = [
    'Dr. P. Manivannan Oncologist Coimbatore',
    'Dr. Shabari Arumugam Dermatologist Coimbatore',
    'Dr. Ram Abhinav Medical Oncologist Coimbatore',
    'Dr Nithya D Dermatologist Peelamedu',
    'Dr Pankaj R Dermatologist Coimbatore',
    'Dr. Anmika N Dermatologist DermaVue Coimbatore',
    'Dr S Kabilan Surgical Oncologist Ramakrishna Hospital',
    'Dr M S Deepa Dermatologist R S Puram Coimbatore',
    'Dr Prof Kumaresan M Dermatologist Coimbatore',
    'Dr P K Koshy Dermatologist Race Course Coimbatore'
]

results = []
try:
    with DDGS() as ddgs:
        for doc in doctors:
            image_url = ''
            try:
                images = list(ddgs.images(doc, max_results=1))
                if images:
                    image_url = images[0]['image']
            except Exception:
                pass
            results.append(image_url)
except Exception as e:
    print(e)
    results = [""] * 10

print(json.dumps(results))
