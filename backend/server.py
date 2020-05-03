from flask import Flask, request
import json
from region import getNearByLocation
from flask_ngrok import run_with_ngrok

app = Flask(__name__)
run_with_ngrok(app)  # Start ngrok when app is run


@app.route('/getLocations', methods=['GET'])
def index():
    lat = request.args.get('lat')
    long = request.args.get('long')
    data = getNearByLocation(float(lat), float(long))
    return json.dumps({'data': data})


# http://127.0.0.1:5000/getLocations?lat=45.6420204&long=25.6157735

if __name__ == "__main__":
    app.run()
