#include <stdio.h>
#include <stdbool.h>

#define EMPTY (rationalT) {0, 0} //GetRational函数碰到无意义输入时返回值

typedef struct {	
	int num;
	int den;
} rationalT;	

rationalT CreateRational(int num, int den);
rationalT AddRational(rationalT r1, rationalT r2);
rationalT MultiplyRational(rationalT r1, rationalT r2);
rationalT GetRational(void);
void PrintRational(rationalT r);
rationalT Symplification(rationalT r);	//返回约分后的r
bool IsEmptyRational(rationalT r);	//检查r是否无意义(是否为EMPTY)
int GCD(int x, int y);	//返回x, y最大公约数


int main()
{
	rationalT sum;
	rationalT temp;

	sum = CreateRational(0, 1);
	puts("This program adds a list of rational numbers.");
	puts("Signal end of list with a 0.");
	while (!IsEmptyRational(temp = GetRational()))
	{
		sum = AddRational(sum, temp);
	}
	printf("The total is ");
	PrintRational(sum);

	return 0;
}

rationalT CreateRational(int num, int den)
{
	return (rationalT){num, den};
}

rationalT AddRational(rationalT r1, rationalT r2)
{
	rationalT sum;

	sum.num = r1.num * r2.den + r1.den * r2.num;
	sum.den = r1.den * r2.den;

	return Symplification(sum);
}

rationalT MultiplyRational(rationalT r1, rationalT r2)
{
	rationalT product;

	product.num = r1.num * r2.num;
	product.den = r1.den * r2.den;

	return Symplification(product);
}

rationalT GetRational(void)
{
	rationalT r;

	if (scanf("%d", &r.num) != 1)
		return EMPTY;
	if ((getchar()) != '/')
		return EMPTY;
	if (scanf("%d", &r.den) != 1)
		return EMPTY;

	return Symplification(r);
}

void PrintRational(rationalT r)
{
	printf("%d/%d\n", r.num, r.den);
}

rationalT Symplification(rationalT r)
{
	int temp;

	if ((temp = GCD(r.num, r.den)) != 1)
	{
		r.num /= temp;
		r.den /= temp;
	}

	return r;
}

bool IsEmptyRational(rationalT r)
{
	if (r.num == 0 && r.den == 0)
		return 1;
	else 
		return 0;
}

int GCD(int x, int y)
{
	while (x != y)
	{
		if (y > x)
		{
			y = y - x;
		}
		else
		{
			x = x - y;
		}
	}

	return x;
}