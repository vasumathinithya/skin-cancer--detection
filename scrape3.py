import urllib.request, re, ssl, json
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    'https://www.gknmhospital.org/doctors/dr-p-manivannan/',
    'https://www.kmchhospitals.com/doctors/dr-ram-abhinav/',
    'https://www.sriramakrishnahospital.com/doctors/dr-s-kabilan/'
]

out = []
for u in urls:
    try:
        html = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent':'Mozilla/5.0'}), context=ctx).read().decode('utf-8')
        m = re.findall(r'<img[^>]+src=\"(https://[^\"?]+(?:\.jpg|\.png|\.webp))\"', html)
        if m: out.append(m[0])
    except Exception as e:
        print(f"Failed {u}: {e}")

print(json.dumps(out, indent=2))
