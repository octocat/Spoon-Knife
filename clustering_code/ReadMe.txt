the scripts can be seperated into several parts:

preprocessing scripts:
NTcharge.py  behave.py
these two scripts change the raw data from Dr.Memory to integer serial numbers.
PS. the path of raw data should be changed if necessary in these two scripts.

algorithm scripts:
the main.py is the whole scripts which relies on cal_lcs.py, cal_dis.py and cluster.py. 
the cal_lcs.py is about LCS problem using dynamic programming 
the cal_dis.py is about SVD algorithm
the cluster.py is about a new clustering algorithm based on graphical theory.

the backup.py relies on cal_lcs.py. this script can find out what the LCS is between two different samples.