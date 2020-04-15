import xml.etree.ElementTree as ET
import geograpy3
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import math


def startParsing():
    myTree = ET.parse('C:\\Users\\Ioana\\Desktop\\ReadingAssistant\\backend\\MappingBooks_standoff.xml')
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
        if len(more_places.cities) > 0:
            places_from_text.append(more_places.cities)

        if len(more_places.regions) > 0:
            places_from_text.append(more_places.regions)

        if len(more_places.places) > 0:
            places_from_text.append(more_places.places)

    # aici calculez lat si long pentru fiecare place din places_from_text
    geolocator = Nominatim()
    lat_lon = []
    for place in places_from_text:
        try:
            location = geolocator.geocode(place)
            if location:
                lat_lon.append(location)
        except GeocoderTimedOut as e:
            print('No place')
    print(lat_lon)
    return lat_lon


# calculez distanta dintre 2 coordonate in metri
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


# calculez locatiile din apropiere
def getNearByLocations():
    nearby_places = []
    my_actual_location = 45.6420204, 25.6157735
    my_radius = 20000

    places = startParsing()
    for city, coord in places:
        distance = haversine(my_actual_location, coord)
        if distance <= my_radius:
            nearby_places.append(city)

    return nearby_places