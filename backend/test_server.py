from server import getLocationRoute, getWikiAPIRoute
from flask import Flask
import json


def test_getLocations_route__success():
    app = Flask(__name__)
    getLocationRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/getLocations?lat=47.157466&long=27.578429'

    mock_request_data = {
        'Palatul Culturii, acces parcare, Ansamblul Palas, Centru, Iași, 700032, România'
    }
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 200


def test_getLocations_route__failure__unauthorized():
    app = Flask(__name__)
    getLocationRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/getLocations?lat=47.157466&long=27.578429'

    mock_request_data = {
        'altceva'
    }
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 401


def test_getLocations_route__failure__bad_request():
    app = Flask(__name__)
    getLocationRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/getLocations?lat=47.157466&long=27.578429'

    mock_request_data = {}
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 400


def test_getWikiAPIRoute_route__success():
    app = Flask(__name__)
    getWikiAPIRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/wikipediaAPI?for_search=palatul'

    mock_request_data = {
        '{"batchcomplete":"","query":{"normalized":[{"from":"Palat ","to":"Palat"}],"pages":{"187301":{'
        '"extract":"Palatul este un edificiu impun\u0103tor care desemneaz\u0103:\n\nre\u0219edin\u021ba urban\u0103 '
        'a unui personaj important, cel mai adesea de origine nobiliar\u0103, cu un mod de via\u021b\u0103 '
        'fastuos;\nsediul unei institu\u021bii publice, \u00een care se exercit\u0103 puterea (politic\u0103, '
        'judiciar\u0103, legislativ\u0103, executiv\u0103)\n(sens figurat) exager\u00e2nd sau flat\u00e2nd, '
        'poate desemna un conac sau o mare proprietate.Trebuie observat\u0103 diferen\u021ba dintre palat \u0219i '
        'castel. \u00cen rom\u00e2n\u0103, ca \u00een alte limbi (ital. Palazzo, franc. Palais, engl. Palace, '
        'span. Palacio), apelativul palat este rezervat unui edificiu urban, \u00een vreme ce numim castel un '
        'edificiu rural. Astfel vorbim pe de o parte de Palatul Buckingham, Palatul Luvru, Palatul Ghika Tei sau '
        'Palatul Parlamentului, \u0219i pe de alt\u0103 parte de Castelul Windsor, Castelul Versailles, '
        'Castelul Pele\u0219 sau Castelul B\u00e1nffy de la Bon\u021bida.","ns":0,"pageid":187301,"title":"Palat"}}}} '
    }
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 200


def test_getWikiAPIRoute_route__failure__unauthorized():
    app = Flask(__name__)
    getWikiAPIRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/wikipediaAPI?for_search=palatul'

    mock_request_data = {
        'altceva'
    }
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 401


def test_getWikiAPIRoute_route__failure__bad_request():
    app = Flask(__name__)
    getWikiAPIRoute(app)
    client = app.test_client()
    url = 'http://127.0.0.1:5000/wikipediaAPI?for_search=palatul'

    mock_request_data = {}
    response = client.get(url, data=json.dumps(mock_request_data))
    assert response.status_code == 400