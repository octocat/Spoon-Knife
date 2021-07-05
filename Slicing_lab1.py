# Exchange first and last item

sequence = input("Enter the string name ")

def Exchange_first_last(sequence):
    """Exchange first and last item in string"""
    
    
    
    if (len(sequence)==1):
        
        return sequence
    
    return (sequence[-1]+sequence[1:-1]+sequence[0])





#Remove every other element from the string

def every_other_itemRemoved(sequence):
    """Remove every other element from the string"""
    
    
    return(sequence[0::2])



def four_itemsRemoved(sequence):
    
    
   """list after first 4,last 4 items removed"""
    
   return(sequence[4:-4:2])

  
def order_thirds(sequence):
    """list after last,fast and middle third in new order"""
   
    
    one_third = int(len(sequence)/3)
    
#    print(one_third) 
    first_third = (sequence[0:one_third]) 
    last_third = (sequence[-one_third:]) 
    middle_third = (sequence[one_third:-one_third]) 
    final_string = last_third + first_third + middle_third 
    return(final_string)


    
def reversed_string(sequence):
    """ display reverse string"""
    
    return(sequence[-1::-1])



print("list after first and last item exchange")
print(Exchange_first_last(sequence))

print("\nlist after every other item removed")
print(every_other_itemRemoved(sequence))

print("\nlist after first 4,last 4 items removed")
print(four_itemsRemoved(sequence))

print("\nlist after last,fast and middle third in new order")
print(order_thirds(sequence))


print("\nlist for reverse string")
print(reversed_string(sequence))
print("\n")


if __name__ == '__main__':
    
 
    # Run Some Tests 
    print("run some test")
    
    a_string = "this is a string" 
    a_tuple = (2, 54, 13, 12, 5, 32)

    a_long_tuple = (2, 54, 40, 17, 22, 52, 10, 9, 45, 34, 15, 12)

    assert Exchange_first_last(a_string) == "ghis is a strint"
   
    
    assert every_other_itemRemoved(a_string) == "ti sasrn" 
 
    assert every_other_itemRemoved (a_tuple)==(2, 13, 5)
    

    assert four_itemsRemoved (a_long_tuple)== (22,10) 

    assert four_itemsRemoved (a_string) == " sas"
    
 
#    assert order_thirds (a_tuple) == (32, 5, 12, 13, 54, 2) 

    assert order_thirds (a_string) == "tringthis is a s" 
    
 
    assert reversed_string(a_tuple) == (32,5,12,13,54,2) 

    assert reversed_string (a_string) == "gnirts a si siht" 


    print("Tests Passed") 

