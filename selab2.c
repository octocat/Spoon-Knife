#include <stdio.h>
int main() {    

    int number1, number2, sum;//takinf first num as number1 and second one asnumber2
    
    printf("Enter two integers: ");
    scanf("%d %d", &number1, &number2);

    // calculating sum
    sum = number1 + number2;   //calculating the sum   
    
    printf("%d + %d = %d", number1, number2, sum);
    return 0;
}