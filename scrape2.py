import urllib.request, re, json, urllib.parse

def get_img(q):
    try:
        url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(q)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        m = re.search(r'//external-content\.duckduckgo\.com/iu/\?u=([^&\"' + "']+" + r')', html)
        if m: 
            return urllib.parse.unquote(m.group(1))
    except Exception as e:
        print(e)
    return ''

d = ['Dr P Manivannan Oncologist Coimbatore', 'Dr Shabari Arumugam Dermatologist', 'Dr Ram Abhinav KMCH', 'Dr Nithya D Dermatologist', 'Dr Pankaj R Dermatologist', 'Dr Anmika N DermaVue', 'Dr S Kabilan Ramakrishna', 'Dr M S Deepa Dermatologist', 'Dr Kumaresan M Dermatologist', 'Dr P K Koshy Dermatologist']
res = [get_img(x) for x in d]
print(json.dumps(res, indent=2))
