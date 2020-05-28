# import googlemaps
#
# gmaps = googlemaps.Client(key='AIzaSyC2xqdEx9v_FwWgfyY6PgCjxoxdqtIA900')
#
# geocode_result = gmaps.geocode("Parcul Copou")
#
# print(geocode_result)

import requests
url = 'https://maps.googleapis.com/maps/api/geocode/json'
params = {'address': 'Parcul Copou', 'key':'AIzaSyCj80ZAoH6j9ClHZHQB-AsfYZWFFcHmBo0'}
r = requests.get(url, params=params)
results = r.json()['results']
location = results[0]['geometry']['location']
print(location['lat'])
print(location['lng'])
