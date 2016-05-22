import random
import sys
import os

def Checker(n):
    my_first_list = my_first_list2 = []

    my_list = [str(n) for n in str(n)]
    middle = (len(my_list)) // 2

    for i in range(0, middle):
        my_first_list.append(my_list[i])
    for i in range(middle+1, (len(my_list))):
        my_first_list2.append(my_list[i])

    if my_first_list ==  my_first_list2 :
        sor = ''.join(sorted(my_list, reverse=True))
        return "AY | " + sor
    else :
        return "NAY | " + ''.join(sorted(my_list, reverse=True))

for line in open("file.txt"):
    print((Checker(line).replace("][", "")).replace("'", ""))







