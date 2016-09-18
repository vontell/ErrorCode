import unittest
import logging
my_logger = logging.getLogger('myapp')
logging.basicConfig(filename='python/testresults.log',level=logging.INFO)
def function():
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 289dfcdb210db9a9d3df26414d59d1dd44f4a773
    return 6takes as input a
number x, and outputs that number squared.
'''
def square(x):
    return x * x

'''
This function returns whether a given list
is empty or not.
'''
def isEmpty(list):
    numItems = len(list)
    return numItems == 0
<<<<<<< HEAD
=======
    return 6


>>>>>>> 3b8c0b7a042db83dd4090f8083399e852b008df9
=======
>>>>>>> 289dfcdb210db9a9d3df26414d59d1dd44f4a773
class UserTestCase0(unittest.TestCase):
    def runTest(self):
