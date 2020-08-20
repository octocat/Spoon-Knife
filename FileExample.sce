x=grand(1,1,"uin",0,100)
y=grand(1,1,"uin",0,100)
if (x==y) then
 disp('integers are the same')
else
 // Creates an array z containing the integers
 // between the maximum and the minimum value 
 // in descending order
 z = max([x,y]):-1:min([x,y]);
 // Creates a Boolean matrix whose elements
 // are ‘true’ whenever the entry of z is
 // a multiple of 4
 multof4 = (modulo(z,4) == 0);
 // Stores the values of z corresponding to
 // 'true' values of multof4
 z2 = z(multof4);
 zsq = z2.^2;
 disp([z2',zsq'])
end

