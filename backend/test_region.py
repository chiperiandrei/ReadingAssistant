import unittest
import region


class TestRegion(unittest.TestCase):

    def test_haversine(self):
        coord1 = 47.157004, 27.589728
        coord2 = 47.154902, 27.605507
        result = region.haversine(coord1, coord2)
        self.assertEqual(result, 1216.121817456174)

    def test_getNearByLocation(self):
        result = region.getNearByLocation(47.157004, 27.589728)
        self.assertEqual(result, 'Palas Mall, Acces Parcare, Ansamblul Palas, Centru, Iași, 700045, România')
