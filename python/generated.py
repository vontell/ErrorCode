import unittest
import logging
my_logger = logging.getLogger('myapp')
logging.basicConfig(filename='python/testresults.log',level=logging.INFO)
def function():
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
class UserTestCase0(unittest.TestCase):
    def runTest(self):
    def function():

class UserTestCase1(unittest.TestCase):
    def runTest(self):
        return 6
def suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(UserTestCase0))
    test_suite.addTest(unittest.makeSuite(UserTestCase1))
    return test_suite

mySuite = suite()
runner = unittest.TextTestRunner()
my_logger.log(logging.INFO,runner.run(mySuite))
