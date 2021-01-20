#include<iostream>
using namespace std;
int main()
{
	int a[3][6];
	for(int i=0;i<3;i++)
	{
		for(int j=0;j<6;j++)
		{
			cin>>a[i][j];
		}
	}
	
	for(int i=0;i<3;i++)
	{
		int counter=1;
		while(counter<6)
		{
			for(int j=0;j<6-counter;j++)
			{
				if(a[i][j]>a[i][j+1])
				{
					int temp=a[i][j];
					a[i][j]=a[i][j+1];
					a[i][j+1]=temp;
				}
			}
			counter++;
		}
	}
	for(int i=0;i<3;i++)
	{
		for(int j=0;j<6;j++)
		{
			cout<<a[i][j];
		}
		cout<<endl;
	}	
}
