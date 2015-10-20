__author__ = 'clustering'

'''
    this script is a expanding program of LCS program
    the cal_lcs.py can get the length of LCS between two samples
    and backup.py can find out what is the LCS contains by cal_lcs.py matrix
'''

import os

def lcs(a,b):
    lena = len(a)
    lenb = len(b)
    c = [[0 for i in range(lenb+1)]for j in range(lena+1)]

    for i in range(lena):
        for j in range(lenb):
            if a[i]==b[j]:
                c[i+1][j+1] = c[i][j] + 1
            elif c[i+1][j] > c[i][j+1]:
                c[i+1][j+1] = c[i+1][j]
            else:
                c[i+1][j+1] = c[i][j+1]
    print c[lena][lenb]
    return c,c[lena][lenb]

def printlcs(m,x,y,sum):
    print len(m),len(m[0])
    print m[len(m)-1][len(m[0])-1]

    dx = [-1,-1, 0]
    dy = [ 0, 1, 1]

    for i in range(dx):





def main(path):
    print 'back...'
    for a,b,filenames in os.walk(path):
        for i in range(len(filenames)):
            if filenames[i]=='.DS_Store':
                continue
            file1 = open(path+'/'+filenames[i])
            list1 = file1.readlines()
            for j in range(i,len(filenames)):
                if filenames[j]=='.DS_Store':
                    continue
                file2 = open(path+'/'+filenames[j])
                list2 = file2.readlines()
                c,Len = lcs(list1,list2)
                printlcs(c)
                raw_input()




if __name__ == '__main__':
    path = '/Users/zzs/Desktop/melweare/behave'
    main(path)