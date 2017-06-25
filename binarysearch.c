#include <stdio.h>
#include <time.h>

void binarysearch(int ls[],int n, int key,int low,int high)
{
    int mid=(low+high)/2;
  while(ls[mid]!=key)//[log n]+1 comparisions
  {
      if(low==high)//[log n]+1 comparisions
      {
          printf("Key not found");
          return ;
      }
      if(ls[mid]>key)//[log n]+1 comparisions
      {
         high=mid-1;
      }
      else if(ls[mid]<key)
      {
          low=mid+1;
      }
    mid=(low+high)/2;

  }
  printf("Key found");
  return ;
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
    printf("Enter the key to be searched\n");
    scanf("%d",&key);
    clock_t t;
    t = clock();
    binarysearch(arr,n,key,0,n-1);
    t = clock() - t;
    double time_taken = ((double)t)/CLOCKS_PER_SEC; // in seconds

    printf("binarysearch() took %f seconds to execute \n", time_taken);
    return 0;
}
