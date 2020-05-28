from collections import namedtuple

import requests
url = 'https://maps.googleapis.com/maps/api/geocode/json'


def get_cordonate(search):
    params = {'address': search, 'key': 'AIzaSyCj80ZAoH6j9ClHZHQB-AsfYZWFFcHmBo0'}
    r = requests.get(url, params=params)
    results = r.json()['results']
    if len(results) > 0:
        location = results[0]['geometry']['location']
        Point = namedtuple('Point', ['lat', 'lng'])
        return Point(location['lat'], location['lng'])
    return None
