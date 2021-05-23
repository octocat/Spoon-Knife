a = int(input())
n1 =('процентов')
n2 =('процент')
n3 =('процента')
if a==0:
    print (a , n1)
elif a%100>=10 and a%100<=20:
     print(a , n1)
elif a%10==1:
     print(a , n2)
elif a%10>= 2 and a%10<=4:
     print(a , n3)
else:
    print(a , n1)