import xml.etree.ElementTree as ET

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

# Pentru a concatena si ultima fraza
finalText['p.' + str(nr_prop)] = ' '.join(proposition)

for key in sorted(finalText, key=lambda j: int(j.split('p.')[1])):
    print(finalText[key])
