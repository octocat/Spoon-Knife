__author__ = 'clustering'

'''

    this script relies on cal_dis.py
    the system has gained the len of LCS between every two samples
    this script use SVD algorithm to calculate the distance between every two samples by LCS

'''

# gain the normalized similarity matrix information from LCS
def GetMat(infilename = 'output.txt',Len=156):
    print "Get LCS's normalization matrix..."
    mat = [[0 for i in range(Len)]for j in range(Len)]
    infile = open(infilename)
    i = 0
    for line in infile.readlines():
        line = line.split('\t')
        line.pop()
        for j in range(len(line)):
            k = j+i
            mat[i][k] = line[j]
            mat[k][i] = line[j]
        i+=1
    return mat

# calculate the distance matrix
def cal_dis(infilename,outfilename,mat):
    print "calculate the distance matrix..."

    ser_list = mat
    len_of_list = len(mat)
    outfile = open(outfilename,'w')

    # calculate the distance to other points one by one
    for i in range(len_of_list):
        print '%f\r'%(float(i)/len_of_list*100),
        for j in range(len_of_list):

            sum = 0
            k=0
            if i==j:
                outfile.write(str(k)+'\t')
                continue
            else:
                for k in range(len_of_list):
                    k = abs( float(ser_list[i][k]) - float(ser_list[j][k]))
                    sum = sum + k
                outfile.write(str(sum)+'\t')
        outfile.write('\n')

    outfile.close()

def main(Len):
    mat = GetMat(infilename = 'output.txt',Len=Len)
    cal_dis(infilename = 'output.txt',outfilename = 'output_2.txt',mat=mat)