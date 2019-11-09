__author__ = 'clustering'

'''
    this is a middle script to count the length of every sample's serial number
    then save in the length.txt file
'''


import os
path = '/Users/zzs/Desktop/melweare/behave'
outfile = open('length.txt','w')
for a,b,filenames in os.walk(path):
        for i in range(len(filenames)):
            if filenames[i]=='.DS_Store':
                continue
            file1 = open(path+'/'+filenames[i])
            list1 = file1.readlines()
            print len(list1)
            outfile.write(str(len(list1))+'\n')