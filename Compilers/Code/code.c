#include <stdio.h>

// ebp-8 =j
// ebp-4 =i
// ebp-12=ctr
//ebp+12 =n
// ebp+8 = arr1
//ebp+16 = fr1
//in calculateFrequency

//in printarraywithfrequency
// ebp-12 =i
//ebp+16 =n
//ebp+12 = fr1
//+4 ,+8  for %d , %d in LC1
//

// cmpl %eax, %edx;
// does %eax-%edx;

//main
//424(esp) == arr1[]

// eax contains only addresses
// eax->address (eax)->value of that address
//movl moves the values in the pointers and they can be immediate or addresses
// leal, add in L5

void calculateFrequency(int arr1[], int n, int fr1[]) {
    int i, j, ctr;

    for (i = 0; i < n; i++) {
        ctr = 1;
        for (j = i + 1; j < n; j++) {
            if (arr1[i] == arr1[j]) {
                ctr++;
                fr1[j] = 0; // Set the frequency of duplicate elements to 0
            }
        }

        if (fr1[i] != 0) {
            fr1[i] = ctr; // Store the frequency of the unique element in the 'fr1' array
        }
    }
}

void printArrayWithFrequency(int arr1[], int fr1[], int n) {
    printf("Element\tFrequency\n");
    for (int i = 0; i < n; i++) {
        if (fr1[i] != 0) {
            printf("%d\t%d\n", arr1[i], fr1[i]);
        }
    }
}

int main() {
    int arr1[100],fr1[100];
   	 int n, i;

   	 printf("\n\nCount frequency of each integer element of an array:\n");
   	 printf("------------------------------------------------\n");
     	printf("Input the number of elements to be stored in the array :");

   	 scanf("%d",&n);
	printf("Enter each elements separated by space: ");
   	for(i=0;i<n;i++)
    	{
    		scanf("%d",&arr1[i]);
    	}
    
    	for (int i = 0; i < n; i++) {
        	fr1[i] = -1;
    	}


    calculateFrequency(arr1, n, fr1);
 
    printArrayWithFrequency(arr1, fr1, n);

    return 0;
}
