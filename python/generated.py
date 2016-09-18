import unittest
import logging
my_logger = logging.getLogger('myapp')
logging.basicConfig(filename='python/testresults.log',level=logging.INFO)
def function():
    return 6
class UserTestCase0(unittest.TestCase):
    def runTest(self):
        self.assertEquals(function(), 6)
def suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(UserTestCase0))
    return test_suite

mySuite = suite()
runner = unittest.TextTestRunner()
my_logger.log(logging.INFO,runner.run(mySuite))
