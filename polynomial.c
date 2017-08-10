#include <stdio.h>
#include <stdlib.h>
#define STAR "**********************************"
#define PROMPT printf("\n\n\n\n"\
					 STAR\
					 "\n4x^3 and 4x^0 should be enter as 4 3 and 4 0 respectively.\n"\
					 "Single line for single polynomial. It should end with an 'e'.\n"\
					 "Example: 4x^2 + 2 should be \"4 2 2 0 e\"\n"\
					 STAR\
					 "\n\n\n");




typedef struct node {

	int coe;				//系数
	int exp;				//指数
	struct node * next;
} Node;

typedef Node * Polynomial;

char menu(void);
Polynomial NewPolynomial(void);			//提示输入，创建新的多项式
Polynomial AddPolynomial(Polynomial po1, Polynomial po2);	//执行加法，返回新多项式
Polynomial SubtractPolynomial(Polynomial po1, Polynomial po2);
Polynomial MultiplyPolynomial(Polynomial po1, Polynomial po2);
void PrintPolynomial(Polynomial po);	//打印多项式
void EmptyPolynomial(Polynomial po);	//清空多项式，释放内存

int main(void)
{
	Polynomial po[3];
	char choice;

	PROMPT
	
	choice = menu();
	while (choice != 'd')
	{
		printf("First polynomial:");
		po[0] = NewPolynomial();
		printf("Second polynomial:");
		po[1] = NewPolynomial();
		switch(choice)
		{
			case 'a':	po[2] = AddPolynomial(po[0], po[1]);
						break;
			case 'b':	po[2] = SubtractPolynomial(po[0], po[1]);
						break;
			case 'c':	po[2] = MultiplyPolynomial(po[0], po[1]);
						break;
			default:	puts("Invalid input. Renter.");
						while(getchar() != '\n')
							continue;
						choice = menu();
						for (int i = 0; i < 2; i++)
						{
							EmptyPolynomial(po[i]);
						}
						continue;
		}
		PrintPolynomial(po[2]);
		for (int i = 0; i < 3; i++)
		{
			EmptyPolynomial(po[i]);
		}
		choice = menu();

	}
	puts("Done.");
	

	return 0;

}

char menu(void)
{
	char ch;

	puts("What do you wanna do?");
	puts("a) Addition");
	puts("b) Subtraction");
	puts("c) Multiplication");
	puts("d) Quit");
	ch = getchar();
	while (getchar() != '\n')
		continue;
	return ch;
}
Polynomial NewPolynomial(void)
{
	int coe;
	int exp;
	Polynomial po = NULL;
	Node * pnewnode;
	Node * pnext;


	while (scanf ("%d %d", &coe, &exp) == 2)
	{
		pnewnode = (Node *) malloc(sizeof(Node));	
		pnewnode->coe = coe;						
		pnewnode->exp = exp;						//填充newnode
		if (po == NULL)
		{
			po = pnewnode;							
			pnext = pnewnode;						
		}
		else
		{
			pnext->next = pnewnode;					
			pnext = pnext->next;					//连接newnode
		}

	}
	while(getchar() != '\n')
		continue;
	if (po != NULL)
	{
		pnext->next = NULL;
	}

	return po;


}

Polynomial AddPolynomial(Polynomial po1, Polynomial po2)
{
	Node * pnext1 = po1;
	Node * pnext2 = po2;
	Node * pnexts;
	Polynomial sum = NULL;
	Node * pnewnode;

	while (pnext1 != NULL || pnext2 != NULL)
	{
		pnewnode = (Node *) malloc(sizeof(Node));			//填充newnode开始
		if (pnext1 == NULL)
		{
			*pnewnode = *pnext2;
			pnext2 = pnext2->next;
		}
		else if (pnext2 == NULL)
		{
			*pnewnode = *pnext1;
			pnext1 = pnext1->next;
		}
		else if (pnext1->exp < pnext2->exp)
		{
			*pnewnode = *pnext2;
			pnext2 = pnext2->next;
		}
		else if (pnext1->exp > pnext2->exp)
		{
			*pnewnode = *pnext1;
			pnext1 = pnext1->next;
		}										
		else 
		{
			if (pnext1->coe + pnext2->coe == 0)
			{
				pnext1 = pnext1->next;
				pnext2 = pnext2->next;
				free(pnewnode);
				continue;
			}
			pnewnode->coe = pnext1->coe + pnext2->coe;
			pnewnode->exp = pnext1->exp;
			pnext2 = pnext2->next;
			pnext1 = pnext1->next;
		}													//填充newnode结束
		if (sum == NULL)
		{
			sum = pnewnode;
			pnexts = pnewnode;
		}
		else
		{
			pnexts->next = pnewnode;
			pnexts = pnexts->next;							//连接newnode
		}
	}
	if (sum != NULL)
	{
		pnexts->next = NULL;
	}

	return sum;
}
Polynomial SubtractPolynomial(Polynomial po1, Polynomial po2)
{
	Node * pnext1 = po1;
	Node * pnext2 = po2;
	Node * pnexts;
	Polynomial difference = NULL;
	Node * pnewnode;

	while (pnext1 != NULL || pnext2 != NULL)
	{
		pnewnode = (Node *) malloc(sizeof(Node));			//填充newnode开始
		if (pnext1 == NULL)
		{
			*pnewnode = *pnext2;
			pnext2 = pnext2->next;
		}
		else if (pnext2 == NULL)
		{
			*pnewnode = *pnext1;
			pnext1 = pnext1->next;
		}
		else if (pnext1->exp < pnext2->exp)
		{
			*pnewnode = *pnext2;
			pnext2 = pnext2->next;
		}
		else if (pnext1->exp > pnext2->exp)
		{
			*pnewnode = *pnext1;
			pnext1 = pnext1->next;
		}										
		else 
		{
			if (pnext1->coe - pnext2->coe == 0)
			{
				pnext1 = pnext1->next;
				pnext2 = pnext2->next;
				free(pnewnode);
				continue;
			}
			pnewnode->coe = pnext1->coe - pnext2->coe;
			pnewnode->exp = pnext1->exp;
			pnext2 = pnext2->next;
			pnext1 = pnext1->next;
		}													//填充newnode结束
		if (difference == NULL)
		{
			difference = pnewnode;
			pnexts = pnewnode;
		}
		else
		{
			pnexts->next = pnewnode;
			pnexts = pnexts->next;							//连接newnode
		}
	}
	if (difference != NULL)
	{
		pnexts->next = NULL;
	}

	return difference;
}

Polynomial MultiplyPolynomial(Polynomial po1, Polynomial po2)
{
	Polynomial product = NULL;
	Node * pnewnode;
	Node * pnext1;
	Node * pnext2;
	Node * pnext3;
	int i;

	if (po1 == NULL || po2 == NULL)
	{
		product = NULL;
	}
	else
	{
		pnext1 = po1;
		pnext2 = po2;
		int a[po1->exp + po2->exp + 1];
		for (i = po1->exp + po2->exp; i >= 0; i--)
		{
			a[i] = 0;
		}

		while (pnext1 != NULL)
		{
			a[pnext1->exp + pnext2->exp] += pnext1->coe * pnext2->coe;
			if (pnext2->next != NULL)
			{
				pnext2 = pnext2->next;
			}
			else
			{
				if (pnext1->next != NULL)
				{
					pnext1 = pnext1->next;
					pnext2 = po2;
				}
				else
				{
					pnext1 = pnext1->next;
				}
			}
		}
		for (i = po1->exp + po2->exp; i >= 0; i--)
		{
			if (a[i] == 0)
			{
				continue;
			}
			else
			{
				pnewnode = (Node *)malloc(sizeof(Node *));
				pnewnode->exp = i;
				pnewnode->coe = a[i];
				if (product == NULL)
				{
					product = pnewnode;
					pnext3 = pnewnode;
				}
				else
				{
					pnext3->next = pnewnode;
					pnext3 = pnext3->next;
				}
			}
		}
		if (product != NULL)
		{
			pnext3->next = NULL;
		}


	}

	return product;
}

void PrintPolynomial(Polynomial po)
{
	Node * pnext = po;

	puts("");
	puts(STAR);
	if (pnext == NULL)
	{
		puts("Empty.");
	}
	else
	{
		
		puts("Result: ");
		while (pnext != NULL)
		{

			if (pnext->next != NULL)
			{
				printf("%dx^%d + ", pnext->coe, pnext->exp);
			}
			else
			{	if (pnext->exp == 0)
				{
					printf("%d", pnext->coe);
				}
				else
				{
					printf("%dx^%d", pnext->coe, pnext->exp);
				}
			}
			pnext = pnext->next;
		}
		putchar('\n');
	}
	puts(STAR);
	puts("");
}

void EmptyPolynomial(Polynomial po)
{
	Node * pnext = po;

	if (po != NULL)
	{
		if (pnext->next != NULL)
		{
			EmptyPolynomial(pnext->next);
		}
		free(pnext);
	}
}