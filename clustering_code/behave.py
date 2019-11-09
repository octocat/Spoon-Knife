__author__ = 'clustering'

'''
this srcipt relies on NTcharge.py
the script is to simplified result-file from system-call numbers into system-call-type numbers
'''

import os
import string

dst_path='/users/apple/Desktop/NT/behave-958/'

for filename in os.listdir('/users/apple/Desktop/NT/result-958'):
    if filename =='.DS_Store':
        continue
    print filename
    list=open('/users/apple/Desktop/NT/result-958/'+filename)
    dst=open(dst_path+filename,'w')
    temp=-1
    current=list.readline()
    while current!='':
        print current
        current=int(current)
        current=current/100
        if current==temp:
            current=list.readline()
            continue
        else:
            dst.write(str(current)+'\n')
            temp=current
            current=list.readline()


