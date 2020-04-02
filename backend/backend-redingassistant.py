import xml.etree.ElementTree as ET
import geograpy3
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import math

myTree = ET.parse('MappingBooks_standoff.xml')
myRoot = myTree.getroot()

proposition = []
finalText = {}
nr_prop = 1

for y in myRoot.findall(".//W[@ID]"):
    word = 'w' + str(nr_prop) + '.'
    if word in y.attrib['ID']:
        proposition.append(y.attrib['text'])
    else:
        finalText['p.' + str(nr_prop)] = ' '.join(proposition)
        proposition = [y.attrib['text']]
        nr_prop = nr_prop + 1
# pentru a concatena si ultima fraza
finalText['p.' + str(nr_prop)] = ' '.join(proposition)


places_from_text = []
for key in sorted(finalText, key=lambda j: int(j.split('p.')[1])):
    # print(finalText[key])
    more_places = geograpy3.get_place_context(text=finalText[key])
    places_from_text.append(more_places.cities)
    places_from_text.append(more_places.regions)
    places_from_text.append(more_places.places)
    print(more_places.cities)
    print(more_places.regions)
    print(more_places.places)


# aici calculez lat si long pentru fiecare place din places_from_text
geolocator = Nominatim()
lat_lon = []
for place in places_from_text:
    try:
        location = geolocator.geocode(place)
        if location:
            print(location.latitude, location.longitude)
            lat_lon.append(location)
    except GeocoderTimedOut as e:
        print("Nu a fost gasita o locatie")
print(lat_lon)


# aici calculez locatiile din apropiere
def haversine(coord1, coord2):
    R = 6372800  # Earth radius in meters
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


my_actual_location = 47.154798, 27.605946
nearby_places = []
# calculate distance between actual location and locations from text
for city, coord in places_from_text:
    distance = haversine(my_actual_location, coord)
    print(city, distance)
