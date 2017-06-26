#include <stdio.h>
#include <time.h>
void linearsearch(int arr[],int n,int key)
{
    int i;
    for(i=0;;i++)
    {
        if(key==arr[i])
        {
            printf("Key found\n");
            return ;
        }
        if(i==n-1) // 1 comparison
        {
              printf("Key Not found\n");
              return ;
        }
    }


}
int main()
{
    int n;
    scanf("%d ",&n);
    int i,arr[n];
    for(i=0;i<n;i++) //n+1 comparisons
    {
        scanf("%d",&arr[i]);
    }
    int key;
    printf("Enter the key to be searched");
    scanf("%d",&key);
    clock_t t;
    t = clock();
    linearsearch(arr,n,key);
    t = clock() - t;
    double time_taken = ((double)t)/CLOCKS_PER_SEC; // in seconds

    printf("linearsearch() took %f seconds to execute \n", time_taken);
    //total (n+2) comparisions
    return 0;

}
