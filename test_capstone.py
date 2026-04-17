import urllib.request
from html.parser import HTMLParser

try:
    req = urllib.request.Request('https://www.capstonebox.com', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print("Found Capstonebox HTML size:", len(html))
    if 'Tarifs transparents' in html:
        print("Text found in HTML!")
except Exception as e:
    print("Error:", e)
