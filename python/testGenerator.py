import argparse

parser = argparse.ArgumentParser(description='Get test as well as test cases.')
parser.add_argument('FUNCTION_FILE', type=str, help='name of file containing the function to test')
parser.add_argument('TEST_FILE', type=str, help='name of the file containing the test cases for the function')

args = parser.parse_args()
#print args.FUNCTION_FILE + " " + args.TEST_FILE

generatedFile = open('generated.py','w')
generatedFile.write("import unittest\n")
functionFile = open(args.FUNCTION_FILE,'r')
testFile = open(args.TEST_FILE,'r')
generatedFile.write(functionFile.read())
generatedFile.write('\n')
functionFile.close()
counter = 0
for line in testFile:
	generatedFile.write("class UserTestCase" + str(counter) + "(unittest.TestCase):\n")
	generatedFile.write("    def runTest(self):\n")
	generatedFile.write("    " + "    self." + line + "\n")
	counter += 1

testFile.close()
generatedFile.write("def suite():\n")
generatedFile.write("    test_suite = unittest.TestSuite()\n")
for x in xrange(counter):
	generatedFile.write("    test_suite.addTest(unittest.makeSuite(UserTestCase" + str(x) + "))\n")

generatedFile.write("    return test_suite\n\n")

generatedFile.write("mySuite = suite()\n")
generatedFile.write("runner = unittest.TextTestRunner()\n")
generatedFile.write("runner.run(mySuite)\n")
generatedFile.close()
