/**********************************************************************
Copyright ©2014 Advanced Micro Devices, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

•	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
•	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or
 other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
********************************************************************/
class calEigenValue
{
protected:
	__global uint* numEigenIntervals;
	__global float* eigenIntervals;
	__global float* diagonal; 
	__global float* offDiagonal;
	uint width;

	uint threadId;
	uint lowerId ;
	uint upperId ;

	float calNumEigenValuesLessThan(const float);

public:
	uint currentIndex;
	
	void initial(__global uint*, __global float*, __global float*, __global float*, const uint);
	void run();
};

class calEigenValue_inherit :public calEigenValue
{
public:
	float class_tolerance;
	__global float * newEigenIntervals;
	void run();
};

void
calEigenValue::initial(
	__global uint* numEigenIntervals,
	__global float* eigenIntervals,
	__global float* diagonal, 
	__global float* offDiagonal,
	uint width
	)
{
	this->numEigenIntervals = numEigenIntervals;
    this->eigenIntervals = eigenIntervals;
    this->diagonal = diagonal ; 
    this->offDiagonal = offDiagonal ;
    this->width = width ;

	this->lowerId = 2 * get_global_id(0);
	this->upperId = lowerId + 1;
}

float  
calEigenValue::calNumEigenValuesLessThan(const float x)
{
    uint count = 0;

    float prev_diff = (this->diagonal[0] - x);
    count += (prev_diff < 0)? 1 : 0;
    for(uint i = 1; i < this->width ; i += 1)
    {
        float diff = (this->diagonal[i] - x) - ((this->offDiagonal[i-1] * this->offDiagonal[i-1]) / prev_diff);

        count += (diff < 0) ? 1 : 0;
        prev_diff = diff;
    }
    return count;
}

void
calEigenValue::run()
{
    float lowerLimit = this->eigenIntervals[lowerId];
    float upperLimit = this->eigenIntervals[upperId];
    
    uint numEigenValuesLessThanLowerLimit = calNumEigenValuesLessThan(lowerLimit);
    uint numEigenValuesLessThanUpperLimit = calNumEigenValuesLessThan(upperLimit);
    
    this->numEigenIntervals[get_global_id(0)] = numEigenValuesLessThanUpperLimit - numEigenValuesLessThanLowerLimit;
}


void
calEigenValue_inherit::run()
{
   this->currentIndex = get_global_id(0);

    uint index = 0;
    while(currentIndex >= this->numEigenIntervals[index])
    {
        currentIndex -= this->numEigenIntervals[index];
        ++index;
    }
     
    uint lId = 2 * index;
    uint uId = lId + 1;
    
    /* if the number of eigenvalues in the interval is just 1 */
    if(this->numEigenIntervals[index] == 1)
    {
        float midValue = (this->eigenIntervals[uId] + this->eigenIntervals[lId])/2;
        float n        = calNumEigenValuesLessThan(midValue);
        n -= calNumEigenValuesLessThan(this->eigenIntervals[lId]);
        
        /* check if the interval size is less than tolerance levels */
        if(this->eigenIntervals[uId] - this->eigenIntervals[lId] < class_tolerance)
        {
            this->newEigenIntervals[this->lowerId] = this->eigenIntervals[lId];
            this->newEigenIntervals[this->upperId] = this->eigenIntervals[uId];
        }
        else if(n == 0) /* if the eigenvalue lies in the right half of the interval */
        {
            this->newEigenIntervals[this->lowerId] = midValue;
            this->newEigenIntervals[this->upperId] = this->eigenIntervals[uId];
        }
        else           /* if the eigenvalue lies in the left half of the interval */
        {
            this->newEigenIntervals[this->lowerId] = this->eigenIntervals[lId];
            this->newEigenIntervals[this->upperId] = midValue;
        }
    }
    /* split the intervals into equal intervals of size divisionWidth */
    else /* (this->numEigenIntervals[index] > 1) */
    {
        float divisionWidth = (this->eigenIntervals[uId] - this->eigenIntervals[lId]) / this->numEigenIntervals[index];
        this->newEigenIntervals[lowerId] = this->eigenIntervals[lId] + divisionWidth * currentIndex;
        this->newEigenIntervals[upperId] = this->newEigenIntervals[lowerId] + divisionWidth;
    }  

}


__kernel 
void calNumEigenValueInterval(__global uint  * numEigenIntervals,
                              __global float * eigenIntervals,
                              __global float * diagonal, 
                              __global float * offDiagonal,
                              uint     width)
{
	calEigenValue EigenValue_A ;
	EigenValue_A.initial(numEigenIntervals,eigenIntervals,diagonal,offDiagonal,width);
	EigenValue_A.run();

}


__kernel 
void recalculateEigenIntervals(__global float * newEigenIntervals,
                               __global float * eigenIntervals,
                               __global uint  * numEigenIntervals,
                               __global float * diagonal,
                               __global float * offDiagonal,
                               const    uint    width,
                               const    float   tolerance)
{
	calEigenValue_inherit EigenValue_B ;
	EigenValue_B.class_tolerance = tolerance;
	EigenValue_B.newEigenIntervals = newEigenIntervals;
	EigenValue_B.initial(numEigenIntervals, eigenIntervals,diagonal,offDiagonal,width);
	EigenValue_B.run();
    
}

