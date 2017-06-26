#!/usr/bin/python
import sys

# recursive palindrome finder function
def isPalindrome(palin):
    if len(palin) == 0 or len(palin) == 1:
        return True
    else:
        if palin[0] != palin[len(palin) - 1]:
            return False
        else:
            return isPalindrome(palin[1:-1])

# main
def main():

	# ensures argument is passed
	try:
	    fileName = sys.argv[1]
	except IndexError:
		print "File argument not given."
		sys.exit()

	# ensures file opens
	try:
		file = open(fileName, 'r')
	except IOError:
		print "Unable to open file! Check if file exists."
		sys.exit()

	for line in file:
		# removes whitespace
		line = "".join(line.split())
		# discards empty lines	
		if len(line) != 0:				
			if isPalindrome(line):
				print "AY",
			else:
				print "NAY",
			# converts to list lexically sorts in reverse order and converts back to string
			print "| " + "".join(sorted(list(line), reverse=True)) 
	file.close()

main()

# TODO unit tests