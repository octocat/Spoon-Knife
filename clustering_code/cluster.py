__author__ = 'clustering'
'''

    this script is about clustering algorithm
    this algorithm is based on graph theory
    it relies on cal_dis.py

two struct of distance matrix:

dict:
{0: {0: 0.0, 1: 9.94990742571, 2: 50.3284653512, 3: 56.6871556022, 4: 9.25756731561, 5: 3.51529440245}}
list:
[[9, 15, 0.0], [10, 11, 0.0], [10, 12, 0.0], [11, 12, 0.0]]
'''
import operator

# get the distance matrix
def GetDis(filename):
    print "get distance matrix..."
    dis_dict = {}
    AllNode = []
    input = open(filename)
    i=0
    for line in input:
        line = line.split('\t')
        dis_dict[i]={}
        for j in range(i+1,len(line)-1):
            t = []
            if i==j:
                dis_dict[i][j] = float('inf')
            else:
                dis_dict[i][j] = float(line[j])
            t.append(i)
            t.append(j)
            t.append(dis_dict[i][j])
            AllNode.append(t)
        i += 1
    AllNode.sort(key=operator.itemgetter(2))
    return  dis_dict,AllNode,i-1

# the main part of the clustering algorithm
def cluster(dis,AllNode,rate):
    print "cluster..."
    MaxLen =  AllNode[-1][2]*rate
    flag = [];t = [];num_dict = {};num = 0
    t.append(AllNode[0][0])
    t.append(AllNode[0][1])
    num_dict[AllNode[0][0]] = num
    num_dict[AllNode[0][1]] = num
    flag.append(t)
    num +=1

    # clustering one by one
    for i in range(1,len(AllNode)):
        a = AllNode[i][0]
        b = AllNode[i][1]
        signal = True

        # when two points' distance is larger than the threshold, halt the program
        if AllNode[i][2] > MaxLen:
            print "cluster end..."
            break

        if a not in num_dict and b not in num_dict:
            num_dict[a] = num;num_dict[b] = num;
            num += 1
            continue

        if a in num_dict and b not in num_dict:
            for key in num_dict:
                if num_dict[key] == num_dict[a]:
                    if check(key,b,dis,MaxLen,1):
                        continue
                    else:
                        signal = False
                        break
            if signal:
                num_dict[b] = num_dict[a]
            continue

        if b in num_dict and a not in num_dict:
            for key in num_dict:
                if num_dict[key] == num_dict[b]:
                    if check(key,a,dis,MaxLen,2):
                        continue
                    else:
                        signal = False
                        break
            if signal:
                num_dict[a] = num_dict[b]
            continue


        if b in num_dict and a in num_dict:
            if num_dict[a] == num_dict[b]:
                continue
            else:
                if num_dict[a] > num_dict[b]:
                    t = num_dict[a]
                    for key in num_dict:
                        if num_dict[key] == t:
                            if check(b,key,dis,MaxLen,3):
                                continue
                            else:
                                signal = False
                                break
                    if signal:
                        for key in num_dict:
                            if num_dict[key] == t:
                                num_dict[key] = num_dict[b]
                    continue
                if num_dict[a] < num_dict[b]:
                    t = num_dict[b]
                    for key in num_dict:
                        if num_dict[key] == t:
                            if check(a,key,dis,MaxLen,4):
                                continue
                            else:
                                signal = False
                                break
                    if signal:
                        for key in num_dict:
                            if num_dict[key] == t:
                                num_dict[key] = num_dict[a]
                    continue
    return num_dict

# To judge whether the distance between two points in one cluster is larger than the threshold or not
def check(a,b,dis,Len,num):
    if b<a:
        t=b;b=a;a=t
    if dis[a][b] <= Len:
        return True
    else:
        return False

def main(filename = 'output_2.txt',rate = 0.2):
    dis_dict,node_list,Len = GetDis(filename)   #get the distance matrix

    num_dict = cluster(dis_dict,node_list,rate)

    num_set = set()
    print "create set..."
    for key in num_dict:
        num_set.add(num_dict[key])

    sum = 0         #the sum of the node who don't have cluster
    print "find node who don't be cluster..."
    for i in range(Len):
        if i not in num_dict:
            num_dict[i] = -1
            sum +=1
    print "************************************************"
    print num_set," length of set:",len(num_set)
    print "the sum of the node who don't have cluster:",sum
    return  num_dict,num_set
