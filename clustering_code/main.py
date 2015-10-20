__author__ ='clustering'

'''
    this script is the main file of the clustering algorithm
    the input of this program is behaves' file. (ps. the state about logs',outputs', results' and behaves' files is in NTcharge.py )
    this script relies on other three scriptes: cal_dis.py, cal_lcs.py and cluster.py
'''


import  cal_dis
import  cal_lcs
import  cluster
import time



def main(thispath,thisrate):
    file1 = open('1.txt','w')

    #record the time costed for calculating the LCS between every two samples
    start = time.time()
    sum_of_file = cal_lcs.main(path = thispath)  #call the function cal_lcs.main to sovle the LCS problem
    end = time.time()
    print " LCS's time :" , end-start

    #record the time costed for calculating the distance between every two samples by the LCS
    start = time.time()
    cal_dis.main(sum_of_file)  #calculate the distance between every two samples by the LCS
    end = time.time()
    print " Calculat distance matrix time :" , end-start

    #record the time costed for operating the clustering algorithm
    start = time.time()
    num_dict,num_set = cluster.main(rate = thisrate)  # call the clustering algorithm
    end = time.time()
    print " Cluster time :" , end-start


    for key in num_dict:
        file1.write(str(num_dict[key])+'\n')
    print len(num_dict)


if __name__ == '__main__':
    start = time.time()  #record the whole time the program costs

    path = '/Users/zzs/Desktop/melweare/behave-5200'  #change the path when the behaves' file changed
    rate = 0.25
    main(path,rate)
    end = time.time()
    print "All the cost of time :" , end-start