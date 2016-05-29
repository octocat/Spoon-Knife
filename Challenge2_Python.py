import random
import sys
import os

def Checker(word):

    my_list = [str(word) for word in str(word)]

    #Check if word match to the reverse
    if word.lower() == word[::-1].lower() :
        return "AY | " + ''.join(sorted(my_list, reverse=True))
    else :
        return "NAY | " + ''.join(sorted(my_list, reverse=True))



file = sys.argv
print("Directory: ", file[1], "\n")
for line in open(file[1]):
    print((Checker(line.rstrip("\n")).replace("][", "")).replace("'", ""))


