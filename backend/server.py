from flask import Flask
import json
from region import getNearByLocations

app = Flask(__name__)


@app.route('/getLocations', methods=['GET'])
def index():
    data = getNearByLocations()
    return json.dumps({'data': data})


if __name__ == "__main__":
    app.run(debug=True)

