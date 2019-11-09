__author__ = 'clustering'

'''
    this script relies on temp.py and behave.py.
    this script is to get the length of LCS(longest-common-subsequence) between every two sample
    dynamic programming is used in this script

'''

import os

def lcs(a,b):

    lena = len(a)
    lenb = len(b)

    # a matrix is built to record the middle result
    c = [[0 for i in range(lenb+1)]for j in range(lena+1)]

    #solve with dynamic programming, O(mn)
    for i in range(lena):
        for j in range(lenb):
            if a[i]==b[j]:
                c[i+1][j+1] = c[i][j] + 1
            elif c[i+1][j] > c[i][j+1]:
                c[i+1][j+1] = c[i+1][j]
            else:
                c[i+1][j+1] = c[i][j+1]
    return c,c[lena][lenb]

def main(path,lcsfilename='output.txt',normalizationfilename='output_1.txt'):
    print 'calculate lcs and normalization ...'
    lcsfile = open(lcsfilename,'w')
    normalization = open(normalizationfilename,'w')
    sum_file = 0
    for a,b,filenames in os.walk(path):
        for i in range(len(filenames)):
            print '%f\r'%(float(i)/len(filenames)*100),
            if filenames[i]=='.DS_Store':    #this is a MAC OS X file, if run in other operating system, it can be deleted
                continue
            sum_file += 1
            file1 = open(path+'/'+filenames[i])
            list1 = file1.readlines()
            for j in range(i,len(filenames)):
                if filenames[j]=='.DS_Store':  #this is a MAC OS X file, if run in other operating system, it can be deleted
                    continue
                file2 = open(path+'/'+filenames[j])
                list2 = file2.readlines()
                if i == j:
                    lcsfile.write('1.0\t')
                    normalization.write(str(len(list2))+'\t')
                    continue
                c,Len = lcs(list1,list2)

                dis = Len/float(len(list1))
                lcsfile.write(str(dis)+'\t')
                normalization.write(str(Len)+'\t')
                file2.close()
            file1.close()
            lcsfile.write('\n')
            normalization.write('\n')
        lcsfile.close()
        normalization.close()
    print "sum of file is:",sum_file
    return sum_file


