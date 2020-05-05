
""" 
---------TODO-----------
    Codul de mai jos o sa vreau sa-l apelez la ruta "/get_description".
    Verbul vreau sa fie GET, si parametrul functiei vreau sa fie dat ca si parametru la request
    content type sa fie de tip aplication json
    
"""







import urllib
import requests
from bs4 import BeautifulSoup

def get_description(place):
        # desktop user-agent
    USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"
    # mobile user-agent
    MOBILE_USER_AGENT = "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36"

    query = place #"Palatul culturii iasi wikipedia"
    query = query.replace(' ', '+')
    URL = f"https://google.com/search?q={query}"

    headers = {"user-agent": USER_AGENT}
    resp = requests.get(URL, headers=headers)

    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        results = []
        for g in soup.find_all('div', class_='r'):
            anchors = g.find_all('a')
            if anchors:
                link = anchors[0]['href']
                title = g.find('h3').text
                item = {
                    "title": title,
                    "link": link
                }
                if "ro." in item["link"]:
                    results.append(item)
        urele = "https://ro.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles={}".format(results[0]["title"][:-11])
        r = requests.get(url = urele)
        id_page = list(r.json()["query"]["pages"].keys())[0]
        print(r.json()["query"]["pages"][id_page]["extract"])
if __name__ == "__main__":
    get_description("Palatul culturii iasi wikipedia")
    