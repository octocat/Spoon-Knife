import numpy as np
import copy

class MinPQ():
    
    def __init__(self):
        self.array = [0]
        self.N = len(self.array)-1
        
    def __str__(self):
        return ''.join(str(self.array))
    
    def swim(self, key):
        while key > 1 and self.larger(key/2, key):
            self.exchange(key/2, key)
            key = key/2
            
    def sink(self, key, n):
        while 2*key <= n:
            if 2*key == n:
                smaller = 2*key
            elif self.larger(2*key + 1, 2*key):
                smaller = 2*key
            else:
                smaller = 2*key + 1
                
            if self.larger(key, smaller):
                self.exchange(key, smaller)
            else:
                break
            
            key = smaller

    def insert(self, val):
        self.N += 1
        self.array += [val]
        self.swim(self.N)
        
        
    def delMin(self):
        min = self.array[1]
        self.exchange(1, self.N)
        self.N -= 1
        self.sink(1, self.N)
        del self.array[self.N+1]
        
        return min
            
    def exchange(self, m, n):
        self.array[m], self.array[n] = self.array[n], self.array[m]
        
    def larger(self, m, n):
        return self.array[m] > self.array[n]
    
    def isEmpty(self):
        return self.N == 0
    
    def heap(self):
        key = self.N/2
        n = self.N
        
        while key >= 1:
            self.sink(key, n)
            key -= 1
        
    def my_sort(self):
        self.heap()
        
        n = self.N
        while(n > 1):
            self.exchange(1, n)
            n -= 1
            self.sink(1, n)
            
            
def main():
    test = MinPQ()
    
    res = list(np.random.random_integers(0,100,30))
    
    for k in res:
        test.insert(k)
    
    print test
    print test.N
    
    test.my_sort()

    print test
    

    
    
if __name__ == '__main__':
    main()
    