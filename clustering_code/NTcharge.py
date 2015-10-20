#coding=utf-8
__author__ = 'clustering'

'''
    this script is to preprocess the raw data
    the logs-file is the original raw data, which is from Dr.Memory
    the outputs-file is simplified from logs-file, which delete the paramaters of system calls
    the results-file change the outputs-file from systemcalls' name into their serial numbers

    the next file to run is behave.py, which simlified results-file
'''

import os
import re

#change these path if neccessary
#log-958 is the raw data from Dr.Memory
source_path='/users/apple/Desktop/NT/log-958'
output_path='/users/apple/Desktop/NT/output-958'
result_path='/users/apple/Desktop/NT/result-958'

file=open('/users/apple/Desktop/NT/3.txt')    # 3.txt is a file which contains all systemCalls and their serial number

NT={}
count=0;
while 1:
    s=file.readline()
    if s=='\n':
        count+=1
        if count==20:
            break
        continue
    try:
        NT[s.split('\t')[1]]=s.split('\t')[0]  # build the system calls table
    except:
        print s+"!!!!"
    count=0
    print NT[s.split('\t')[1]]


for filename in os.listdir(source_path):
    html = open(source_path+'/'+filename)
    outfile = open(output_path+'/output_'+filename,'w')
    sum = 0

    #generate outputs' file
    for line in html.readlines():
        an = re.search(r'\bNt\w*\b',line)

        if an is not None:
            sum += 1
            line = line.split(".")
            outfile.write(line[0])
    outfile.close()





    #generate results' file
    file_sample=open(output_path+'/output_'+filename)
    file_result=open(result_path+'/result_'+filename,'w')
    while 1:
        temp=file_sample.readline()
        if temp=='':
            break
        if str(NT.get(temp))=='None':
            continue
         #check from the NT table and change the system call from name into serial number
        file_result.write(str(NT.get(temp))+'\n')

    file_sample.close()
    file_result.close()










