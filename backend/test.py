from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

cities = ['Tangier', 'Paris', 'Temple']

geolocator = Nominatim()
lat_lon = []
for city in cities:
    try:
        location = geolocator.geocode(city)
        if location:
            print(location.latitude, location.longitude)
            lat_lon.append(location)
    except GeocoderTimedOut as e:
        print("Error: geocode failed on input %s with message %s", (city, e))

print(lat_lon)