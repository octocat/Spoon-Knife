// 00100 - The 3n+1 problem (Max Cycle Length)

#include <stdio.h>
#include <algorithm>

using namespace std;

typedef unsigned short       ushort;
typedef unsigned int         uint;
typedef unsigned long long   ull;

const uint SIZE = 1000001;

ushort tableCycleLength[SIZE];

uint NextNum(uint n)
{
    // Note: 0 treated as odd=> 0: 3*(0) + 1 => 1
    return
        //(n != 0 && n%2 == 0)
        (n != 0 && (n&1) == 0)
            //? n/2 : 3*n +1;
            ? n>>1 : 3*n +1;
}


ushort CycleLength(uint n)
{
    // Note: 0 treated as odd=> 0: 3*(0) + 1 => 1
    // 0 has Sequence [0 1] => length = 2
    
    // base case :
    // 0 has a cycle length of 2
    // 1 has a cycle length of 1
    if (tableCycleLength[n] == 0)
    {
        if (n == 0) tableCycleLength[n] = 2;
        if (n == 1) tableCycleLength[n] = 1;
        //if (n == 2) tableCycleLength[n] = 2;
    }
    if (n < SIZE)
    {
        // if we've already cached the cycle length of the current number
        if (tableCycleLength[n] != 0) return tableCycleLength[n];
    }

    // --------------------------------------------------
    //int nn = n;
    //ushort numberOfCycles = 0;
    //if (tableCycleLength[n] == 0)
    //{
    //    while (nn != 1)
    //    {
    //        if (tableCycleLength[nn] != 0)
    //        {
    //            numberOfCycles = tableCycleLength[nn] + numberOfCycles;
    //            nn = 1;
    //        }
    //        else
    //        {
    //            nn = NextNum(nn);
    //            numberOfCycles++;
    //        }
    //    }
    //}
    //else
    //{
    //    numberOfCycles = tableCycleLength[nn] + numberOfCycles;
    //    nn = 1;
    //}

    //tableCycleLength[n] = numberOfCycles;

    // --------------------------------------------------

    int nn = n;
    int maxCycleLength = 1;

    ull queue[512]; // 524
    uint q_size = 0;
    while (nn >= SIZE || tableCycleLength[nn] == 0)
    {
        nn = NextNum(nn);

        if (nn < SIZE)
        {
            queue[q_size++] = nn;
            if (tableCycleLength[nn] != 0)
                break;
        } 
        else
        { 
            queue[q_size++] = 0;
        }

        ++maxCycleLength;
    }

    tableCycleLength[n] = tableCycleLength[nn] + maxCycleLength;

    for (uint x = 0; x < q_size; ++x)
    {
        ushort& value = tableCycleLength[queue[x]];
        if (value == 0) value = tableCycleLength[n] - (x + 1);
    }
    // --------------------------------------------------

    //// the cycle length of the current number is 1 greater than the cycle length of the next number
    //int cyclelength = 1 + CycleLengthR(NextNum(n));

    //// cache the result if the current number is not too big
    //if (n < SIZE)
    //{
    //    tableCycleLength[n] = cyclelength;
    //}

    // --------------------------------------------------
    
    //if (n < SIZE) 
    //{
    //    int nn;
    //    if ((n&1) == 0)
    //    {
    //        nn = NextNum(n);
    //    }
    //    else
    //    {
    //        nn = NextNum(n) >> 1;
    //        tableCycleLength[n] = 1; 
    //    }
    //    tableCycleLength[n] += 1 + CycleLength(nn);
    //}
    //else
    //{
    //    int num_OE = 0;
    //    if ((n&1) == 0)
    //    {
    //        n = NextNum(n);
    //    }
    //    else
    //    {
    //        // calc two steps at one
    //        n = NextNum(n) >> 1;
    //        num_OE = 1;
    //    }
    //    return num_OE + 1 + CycleLength(n);
    //}
    // --------------------------------------------------
    
    return tableCycleLength[n];
}

ushort MaxCycleLength(uint lowerBound, uint upperBound)
{
    ushort maxCycleLength = 0;
    for (int num = lowerBound; num <= upperBound; ++num)
    {
        maxCycleLength = max(CycleLength(num), maxCycleLength);
    }
    return maxCycleLength;
}

void main()
{	
    FILE* file = freopen("00100.in", "r", stdin);
    if (file != NULL)
    {
        freopen("00100.out", "w", stdout);

        // initalize table
        tableCycleLength[0] = 2;
        tableCycleLength[1] = 1;

        uint i, j;
        while (scanf("%u %u", &i, &j) == 2) // != EOF
        {		
            uint lowerBound = min(i, j);
            uint upperBound = max(i, j);

            ushort maxCycleLength = MaxCycleLength(lowerBound, upperBound);

            printf(" %d\n", maxCycleLength);
        }
    }
    fflush(stdin);
}