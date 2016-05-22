import random
import sys
import os

def Checker(n):
    my_first_list = []
    my_first_list2 = []

    my_list = [str(n) for n in str(n)]
    middle = (len(my_list)) // 2
    size = len(my_list)

    for i in range(0, middle):
        my_first_list.append(my_list[i])

    for i in range(middle, size):
            my_first_list2.append(my_list[i])

    sor = sorted(my_first_list2,reverse=False)

    if my_first_list ==  sor :
        return "AY | " + ''.join(sorted(my_list, reverse=True))
    else :
        return "NAY | " + ''.join(sorted(my_list, reverse=True))

for line in open("file.txt"):
    print((Checker(line.rstrip("\n")).replace("][", "")).replace("'", ""))


