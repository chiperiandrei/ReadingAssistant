import geograpy3
from geopy.exc import GeocoderTimedOut
import math

from getCordonate import get_cordonate


def startParsing():
    file = open('C:/Users/Ioana/Desktop/ReadingAssistant/backend/input_1.txt', 'r', encoding='utf-8')

    places_from_text = []
    more_places = geograpy3.get_place_context(text=file.read())
    if len(more_places.cities) > 0:
        places_from_text.append(more_places.cities)

    if len(more_places.regions) > 0:
        places_from_text.append(more_places.regions)

    if len(more_places.places) > 0:
        places_from_text.append(more_places.places)

    lat_lon = []
    for places in places_from_text:
        for place in places:
            try:
                location = get_cordonate(place)
                if location is not None:
                    lat_lon.append((place, location))
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


# calculez cea mai apropiata locatie
def getNearByLocation(lat, long):
    nearby_place = ""
    min = 1000000
    my_actual_location = lat, long
    my_radius = 50.000

    places = startParsing()
    for city, coord in places:
        distance = (haversine(my_actual_location, coord))/1000
        if (distance <= my_radius) & (distance < min):
            min = distance
            nearby_place = city
    return nearby_place
