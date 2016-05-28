import random
import sys
import os

def Checker(word):

    my_list = [str(word) for word in str(word)]

    #Check if work match to the reverse
    if word.lower() == word[::-1].lower() :
        return "AY | " + ''.join(sorted(my_list, reverse=True))
    else :
        return "NAY | " + ''.join(sorted(my_list, reverse=True))

for line in open("file.txt"):
    print((Checker(line.rstrip("\n")).replace("][", "")).replace("'", ""))


