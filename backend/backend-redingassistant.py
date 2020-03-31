import xml.etree.ElementTree as ET
import geograpy3

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

print(places_from_text)

######

earthRadius = 6372.8

