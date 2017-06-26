#include <stdio.h>
#include <stdlib.h>
int main()
{
    int i=1;
    while(1)
    {
        int *arr;
        arr=(int*)malloc(i*sizeof(int));//dynamic memory allocated using malloc
        if(arr==NULL)
        {
            printf("Error:i max value is %d",i);
             return 0;
        }
        printf("%d\n",i);
        i++;
        free(arr);
    }
}
