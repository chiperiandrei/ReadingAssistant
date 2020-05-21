from flask import Flask, request, make_response
import json
from region import getNearByLocation
from flask_ngrok import run_with_ngrok
from to_be_implemented import get_description

app = Flask(__name__)
run_with_ngrok(app)  # Start ngrok when app is run


@app.route('/getLocations', methods=['GET'])
def getLocationRoute():
    lat = request.args.get('lat')
    long = request.args.get('long')
    data = getNearByLocation(float(lat), float(long))
    r = make_response(data)
    r.mimetype = 'application/json'
    return r


@app.route('/wikipediaAPI', methods=['GET'])
def getWikiAPIRoute():
    for_search = request.args.get('for_search')
    data = get_description(for_search)
    r = make_response(data)
    r.mimetype = 'application/json'
    return r


# http://[id].ngrok.io/getLocations?lat=47.157466&long=27.578429
# http://[id].ngrok.io/wikipediaAPI?for_search=palatul

if __name__ == "__main__":
    app.run()
