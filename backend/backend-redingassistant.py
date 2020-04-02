import xml.etree.ElementTree as ET
import geograpy3

from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut


myTree = ET.parse('MappingBooks_standoff.xml')
myRoot = myTree.getroot()

my_latitude = 47.154798
my_longitude = 27.605946

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

# Pentru a concatena si ultima fraza
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

# print(places_from_text)


# aici calculez lat si lon pentru fiecare place din places_from_text
geolocator = Nominatim()
lat_lon = []
for place in places_from_text:
    try:
        location = geolocator.geocode(place)
        if location:
            print(location.latitude, location.longitude)
            lat_lon.append(location)
    except GeocoderTimedOut as e:
        print("Error: geocode failed on input %s with message %s", (place, e))

print(lat_lon)

# earthRadius = 6372.8

