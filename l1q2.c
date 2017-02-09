/*
Author : Meet Shah
ID : 201501185
*/
#include<stdio.h>
#include<unistd.h>
#include<sys/wait.h>
#include<stdlib.h>

int main()
{

	int n,i;
	char cmd[25];
	pid_t pid = getpid();
	scanf("%d",&n);
	int l[n],r[n];
	int count = 1;
	for(i=0;i<n;i++)
	{
		printf("[%d] pid %d, ppid %d\n",count,getpid(),getppid());
		if(i==n-1)
			break;
		if((l[i]=fork())!=0)
		{
			if((r[i]=fork())!=0)
			{
				if(l[i]<r[i])
				{
					printf("[%d] pid %d created left child with PID %d\n",count,getpid(),l[i]);
					printf("[%d] pid %d created right child with PID %d\n",count,getpid(),r[i]);
				}
				else
				{
					printf("[%d] pid %d created left child with PID %d\n",count,getpid(),r[i]);
					printf("[%d] pid %d created right child with PID %d\n",count,getpid(),l[i]);
				}
				break;
			}
			else
			{
				count=count+ (2*i)+2;
				continue;
			}
		}
		else
		{
			count=count+(2*i)+ 1;
			continue;
		}
	}
	int stat;
	if(l[i]>r[i])
	{
		int tmp = l[i];
		l[i] = r[i];
		r[i] = tmp;
	}
	int pid1 = waitpid(l[i],&stat,0);	
	if(WIFEXITED(stat) && pid1!=-1)
        printf("[%d] left  child %d of %d exited with status %d\n",count,pid1,getpid(),WEXITSTATUS(stat));
	int pid2 = waitpid(r[i],&stat,0);
	if(WIFEXITED(stat) && pid2!=-1)
	printf("[%d] right child %d of %d exited with status %d\n",count,pid2,getpid(),WEXITSTATUS(stat));
	exit(count);
	getc(stdin);
	sprintf(cmd , "pstree -p %d\n" ,pid);
	system(cmd);
	kill(-pid, SIGKILL);
}

