/**********************************************************************
Copyright ©2014 Advanced Micro Devices, Inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

•   Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
•   Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or
 other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
********************************************************************/


#include "EigenValue.hpp"

int EigenValue::setupEigenValue()
{
    // allocate and init memory used by host

    // allocate memory for diagonal elements of the matrix  of size lengthxlength

    if(length < 256)
    {
        length = 256;
    }

    cl_uint diagonalSizeBytes = length * sizeof(cl_float);
    diagonal = (cl_float *) malloc(diagonalSizeBytes);
    CHECK_ALLOCATION(diagonal, "Failed to allocate host memory. (diagonal)");

    // allocate memory for offdiagonal elements of the matrix of length (length-1)
    cl_uint offDiagonalSizeBytes = (length - 1) * sizeof(cl_float);
    offDiagonal = (cl_float *) malloc(offDiagonalSizeBytes);
    CHECK_ALLOCATION(offDiagonal, "Failed to allocate host memory. (offDiagonal)");

    /*
     * allocate memory to store the eigenvalue intervals interleaved with upperbound followed
     * by the lower bound interleaved
     * An array of two is used for using it for two different passes
     */
    cl_uint eigenIntervalsSizeBytes = (2*length) * sizeof(cl_float);
    for(int i=0 ; i < 2; ++i)
    {
        eigenIntervals[i] = (cl_float *) malloc(eigenIntervalsSizeBytes);
        CHECK_ALLOCATION(eigenIntervals[i],
                         "Failed to allocate host memory. (eigenIntervals)");
    }

    // random initialisation of input using a seed
    fillRandom<cl_float>(diagonal   , length  , 1, 0, 255, seed);
    fillRandom<cl_float>(offDiagonal, length-1, 1, 0, 255, seed+10);

    // calculate the upperbound and the lowerbound of the eigenvalues of the matrix
    cl_float lowerLimit;
    cl_float upperLimit;
    computeGerschgorinInterval(&lowerLimit, &upperLimit, diagonal, offDiagonal,
                               length);

    // initialize the eigenvalue intervals
    eigenIntervals[0][0]= lowerLimit;
    eigenIntervals[0][1]= upperLimit;

    // the following intervals have no eigenvalues
    for(cl_int i=2 ; i < 2*length ; i++)
    {
        eigenIntervals[0][i] = upperLimit;
    }

    epsilon   = 0.001f;
    tolerance = 0.001f;
    /*
     * Unless quiet mode has been enabled, print the INPUT array.
     */
    if(!sampleArgs->quiet)
    {
        printArray<cl_float>(
            "Diagonal",
            diagonal,
            length,
            1);
        printArray<cl_float>(
            "offDiagonal",
            offDiagonal,
            length-1,
            1);
    }

    return SDK_SUCCESS;
}

int
EigenValue::genBinaryImage()
{
    bifData binaryData;
    binaryData.kernelName = std::string("EigenValue_Kernels.cl");
    binaryData.flagsStr = std::string("");
    if(sampleArgs->isComplierFlagsSpecified())
    {
        binaryData.flagsFileName = std::string(sampleArgs->flags.c_str());
    }

    binaryData.binaryName = std::string(sampleArgs->dumpBinary.c_str());
    int status = generateBinaryImage(binaryData);
    return status;
}


int
EigenValue::setupCL(void)
{
    cl_int status = 0;

    cl_device_type dType;

    if(sampleArgs->deviceType.compare("cpu") == 0)
    {
        dType = CL_DEVICE_TYPE_CPU;
    }
    else //deviceType = "gpu"
    {
        dType = CL_DEVICE_TYPE_GPU;
        if(sampleArgs->isThereGPU() == false)
        {
            std::cout << "GPU not found. Falling back to CPU device" << std::endl;
            dType = CL_DEVICE_TYPE_CPU;
        }
    }

    /*
     * Have a look at the available platforms and pick either
     * the AMD one if available or a reasonable default.
     */
    cl_platform_id platform = NULL;
    int retValue = getPlatform(platform, sampleArgs->platformId,
                               sampleArgs->isPlatformEnabled());
    CHECK_ERROR(retValue, SDK_SUCCESS, "sgetPlatform() failed");

    // Display available devices.
    retValue = displayDevices(platform, dType);
    CHECK_ERROR(retValue, SDK_SUCCESS, "displayDevices() failed");

    // If we could find our platform, use it. Otherwise use just available platform.
    cl_context_properties cps[3] =
    {
        CL_CONTEXT_PLATFORM,
        (cl_context_properties)platform,
        0
    };

    context = clCreateContextFromType(
                  cps,
                  dType,
                  NULL,
                  NULL,
                  &status);
    CHECK_OPENCL_ERROR(status, "clCreateContextFromType failed.");

    // getting device on which to run the sample
    status = getDevices(context, &devices, sampleArgs->deviceId,
                        sampleArgs->isDeviceIdEnabled());
    CHECK_ERROR(status, 0, "getDevices() failed");


    {
        // The block is to move the declaration of prop closer to its use
        cl_command_queue_properties prop = 0;
        commandQueue = clCreateCommandQueue(
                           context,
                           devices[sampleArgs->deviceId],
                           prop,
                           &status);
        CHECK_OPENCL_ERROR(status, "clCreateCommandQueue failed.");
    }

    // Set Presistent memory only for AMD platform
    cl_mem_flags inMemFlags = CL_MEM_READ_ONLY;
    if(sampleArgs->isAmdPlatform())
    {
        inMemFlags |= CL_MEM_USE_PERSISTENT_MEM_AMD;
    }

    // cl mem to store the diagonal elements of the matrix
    diagonalBuffer = clCreateBuffer(
                         context,
                         inMemFlags,
                         sizeof(cl_float) * length,
                         NULL,
                         &status);
    CHECK_OPENCL_ERROR(status, "clCreateBuffer failed. (diagonalBuffer)");

    // cl mem to store the number of eigenvalues in each interval
    numEigenValuesIntervalBuffer = clCreateBuffer(
                                       context,
                                       CL_MEM_READ_WRITE | CL_MEM_ALLOC_HOST_PTR,
                                       sizeof(cl_uint) * length,
                                       NULL,
                                       &status);
    CHECK_OPENCL_ERROR(status, "clCreateBuffer failed. (diagonalBuffer)");

    // cl mem to store the offDiagonal elements of the matrix
    offDiagonalBuffer = clCreateBuffer(
                            context,
                            inMemFlags,
                            sizeof(cl_float) * (length-1),
                            NULL,
                            &status);
    CHECK_OPENCL_ERROR(status, "clCreateBuffer failed. (offDiagonalBuffer)");

    // cl mem to store the eigenvalue intervals
    for(int i = 0 ; i < 2 ; ++ i)
    {
        eigenIntervalBuffer[i] = clCreateBuffer(
                                     context,
                                     CL_MEM_READ_WRITE | CL_MEM_ALLOC_HOST_PTR,
                                     sizeof(cl_uint) * length * 2,
                                     NULL,
                                     &status);
        CHECK_OPENCL_ERROR(status, "clCreateBuffer failed. (eigenIntervalBuffer)");
    }

    // create a CL program using the kernel source
    buildProgramData buildData;
    buildData.kernelName = std::string("EigenValue_Kernels.cl");
    buildData.devices = devices;
    buildData.deviceId = sampleArgs->deviceId;
    buildData.flagsStr = std::string("-x clc++");
    if(sampleArgs->isLoadBinaryEnabled())
    {
        buildData.binaryName = std::string(sampleArgs->loadBinary.c_str());
    }

    if(sampleArgs->isComplierFlagsSpecified())
    {
        buildData.flagsFileName = std::string(sampleArgs->flags.c_str());
    }

    retValue = buildOpenCLProgram(program, context, buildData);
    CHECK_ERROR(retValue, 0, "buildOpenCLProgram() failed");

    // get a kernel object handle for a kernel with the given name
    kernel[0] = clCreateKernel(program, "calNumEigenValueInterval", &status);
    if(checkVal(
                status,
                CL_SUCCESS,
                "clCreateKernel failed."))
    {
        return SDK_FAILURE;
    }

    // get a kernel object handle for a kernel with the given name
    kernel[1] = clCreateKernel(program, "recalculateEigenIntervals", &status);
    if(checkVal(
                status,
                CL_SUCCESS,
                "clCreateKernel failed."))
    {
        return SDK_FAILURE;
    }

    return SDK_SUCCESS;
}

/*
 * Checks if the difference between lowerlimit and upperlimit of all intervals is below
 * tolerance levels
 */
int
EigenValue::isComplete(cl_float * eigenIntervals)
{
    for(cl_int i=0; i< length; i++)
    {
        cl_uint lid = 2*i;
        cl_uint uid = lid + 1;
        if(eigenIntervals[uid] - eigenIntervals[lid] >= tolerance)
        {
            return SDK_FAILURE;
        }
    }
    return SDK_SUCCESS;
}

int EigenValue::setWorkGroupSize()
{
    cl_int   status;

    globalThreads[0] = length;
    localThreads[0]  = 256;

    // Check group size against kernelWorkGroupSize
    status = kernelInfo.setKernelWorkGroupInfo(kernel[0], devices[sampleArgs->deviceId]);

    if((cl_uint)(localThreads[0]) > kernelInfo.kernelWorkGroupSize)
    {
        if(!sampleArgs->quiet)
        {
            std::cout<<"Out of Resources!" << std::endl;
            std::cout<<"Group Size specified : "<<localThreads[0]<<std::endl;
            std::cout<<"Max Group Size supported on the kernel : "
                     <<kernelInfo.kernelWorkGroupSize<<std::endl;
            std::cout<<"Changing the group size to " << kernelInfo.kernelWorkGroupSize
                     << std::endl;
        }

        localThreads[0] = kernelInfo.kernelWorkGroupSize;
    }
    return SDK_SUCCESS;
}

int
EigenValue::runCLKernels(void)
{
    /*
     * The number of eigenvalues in each interval are calculated using kernel[0] i.e. "calNumEigenValueInterval".
     * Once we have the number of eigenvalues in each interval, the intervals are recalculated such that
      * 1. Discards the intervals with no eigenvalues
      * 2. Checks if the number of eigenvalues in an interval is 1 and further splits that
      *    interval into two halfs and considers the interval in which the eigenvalue exists
      * 3. if the number of eigenvalues is more than n i.e. more than 1. The interval is split
      *    into n equal intervals.
      */
    cl_int status = 0;

    status = this->setWorkGroupSize();
    CHECK_ERROR(status, SDK_SUCCESS, "setKernelWorkGroupSize() failed");

    // Set required input
    cl_event writeEvt[4];
    status = clEnqueueWriteBuffer(
                 commandQueue,
                 diagonalBuffer,
                 CL_FALSE,
                 0,
                 sizeof(cl_float) * length,
                 diagonal,
                 0,
                 NULL,
                 &writeEvt[0]);
    CHECK_OPENCL_ERROR(status, "clEnqueueWriteBuffer failed. (diagonalBuffer)");

    status = clEnqueueWriteBuffer(
                 commandQueue,
                 offDiagonalBuffer,
                 CL_FALSE,
                 0,
                 sizeof(cl_float) * (length - 1),
                 offDiagonal,
                 0,
                 NULL,
                 &writeEvt[1]);
    CHECK_OPENCL_ERROR(status, "clEnqueueWriteBuffer failed. (offDiagonalBuffer)");

    // cl mem to store the eigenvalue intervals
    for(int i = 0 ; i < 2 ; ++ i)
    {
        status = clEnqueueWriteBuffer(
                     commandQueue,
                     eigenIntervalBuffer[i],
                     CL_FALSE,
                     0,
                     sizeof(cl_uint) * length * 2,
                     eigenIntervals[i],
                     0,
                     NULL,
                     &writeEvt[i + 2]);
        CHECK_OPENCL_ERROR(status,
                           "clEnqueueWriteBuffer failed. (eigenIntervalBuffer)");
    }

    status = clFlush(commandQueue);
    CHECK_OPENCL_ERROR(status, "clFlush failed.");

    status = waitForEventAndRelease(&writeEvt[0]);
    CHECK_ERROR(status, SDK_SUCCESS, "WaitForEventAndRelease(writeEvt[0]) Failed");

    status = waitForEventAndRelease(&writeEvt[1]);
    CHECK_ERROR(status, SDK_SUCCESS, "WaitForEventAndRelease(writeEvt[1]) Failed");

    status = waitForEventAndRelease(&writeEvt[2]);
    CHECK_ERROR(status, SDK_SUCCESS, "WaitForEventAndRelease(writeEvt[2]) Failed");

    status = waitForEventAndRelease(&writeEvt[3]);
    CHECK_ERROR(status, SDK_SUCCESS, "WaitForEventAndRelease(writeEvt[3]) Failed");

    // Set appropriate arguments to the kernel

    // first argument for kernel[0] - number of eigenvalues in each interval
    status = clSetKernelArg(
                 kernel[0],
                 0,
                 sizeof(cl_mem),
                 (void *)&numEigenValuesIntervalBuffer);
    CHECK_OPENCL_ERROR(status,
                       "clSetKernelArg failed. (numEigenValuesIntervalBuffer)");

    // third argument for kernel[0] - Diagonal elements of the matrix
    status = clSetKernelArg(
                 kernel[0],
                 2,
                 sizeof(cl_mem),
                 (void *)&diagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (diagonalBuffer)");

    // fourth argument for kernel[0] - offDiagonal elements of the matrix
    status = clSetKernelArg(
                 kernel[0],
                 3,
                 sizeof(cl_mem),
                 (void *)&offDiagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (offDiagonalBuffer)");

    // length - i.e number of elements in the array
    status = clSetKernelArg(
                 kernel[0],
                 4,
                 sizeof(cl_uint),
                 (void *)&length);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (length)");

    // third argument for kernel[1] - Number of eigenvalues in each interval
    status = clSetKernelArg(
                 kernel[1],
                 2,
                 sizeof(cl_mem),
                 (void *)&numEigenValuesIntervalBuffer);
    CHECK_OPENCL_ERROR(status,
                       "clSetKernelArg failed. (numEigenValuesIntervalBuffer)");

    // fourth argument for kernel[1]- Diagonal elements of the matrix
    status = clSetKernelArg(
                 kernel[1],
                 3,
                 sizeof(cl_mem),
                 (void *)&diagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (diagonalBuffer)");

    // fifth argument for kernel[1] - offDiagonal elements of the matrix
    status = clSetKernelArg(
                 kernel[1],
                 4,
                 sizeof(cl_mem),
                 (void *)&offDiagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (offDiagonalBuffer)");

    // sixth argument for kernel[1] - length
    status = clSetKernelArg(
                 kernel[1],
                 5,
                 sizeof(cl_uint),
                 (void *)&length);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (length)");

    // sixth argument for kernel[1] - tolerance
    status = clSetKernelArg(
                 kernel[1],
                 6,
                 sizeof(cl_float),
                 (void *)&tolerance);
    CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (tolerance)");

    in = 0;
    while(isComplete(eigenIntervals[in]))
    {
        // second argument for kernel[0] - input eigenvalue intervals
        status = clSetKernelArg(
                     kernel[0],
                     1,
                     sizeof(cl_mem),
                     (void *)&eigenIntervalBuffer[in]);
        CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (inputBuffer)");

        // first argument for kernel[0] - recalculated eigenvalue intervals
        status = clSetKernelArg(
                     kernel[1],
                     0,
                     sizeof(cl_mem),
                     (void *)&eigenIntervalBuffer[1 - in]);
        CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (inputBuffer)");

        // second argument for kernel[0] - original eigenvalue intervals
        status = clSetKernelArg(
                     kernel[1],
                     1,
                     sizeof(cl_mem),
                     (void *)&eigenIntervalBuffer[in]);
        CHECK_OPENCL_ERROR(status, "clSetKernelArg failed. (inputBuffer)");

        cl_event ndrEvt1;
        status = clEnqueueNDRangeKernel(
                     commandQueue,
                     kernel[0],
                     1,
                     NULL,
                     globalThreads,
                     localThreads,
                     0,
                     NULL,
                     &ndrEvt1);
        CHECK_OPENCL_ERROR(status, "clEnqueueNDRangeKernel failed.");

        status = clFlush(commandQueue);
        CHECK_OPENCL_ERROR(status, "clFlush failed.");

        status = waitForEventAndRelease(&ndrEvt1);
        CHECK_ERROR(status, SDK_SUCCESS, "WaitForEventAndRelease(writeEvt[3]) Failed");

        cl_event ndrEvt2;
        status = clEnqueueNDRangeKernel(
                     commandQueue,
                     kernel[1],
                     1,
                     NULL,
                     globalThreads,
                     localThreads,
                     0,
                     NULL,
                     &ndrEvt2);
        CHECK_OPENCL_ERROR(status, "clEnqueueNDRangeKernel failed.");

        status = clFlush(commandQueue);
        CHECK_OPENCL_ERROR(status, "clFlush failed.");

        status = waitForEventAndRelease(&ndrEvt2);
        CHECK_OPENCL_ERROR(status, "waitForEvent failed.");

        in = 1 - in;

        // Enqueue readBuffer
        cl_event readEvt;
        status = clEnqueueReadBuffer(
                     commandQueue,
                     eigenIntervalBuffer[in],
                     CL_FALSE,
                     0,
                     length * 2 * sizeof(cl_uint),
                     eigenIntervals[in],
                     0,
                     NULL,
                     &readEvt);
        CHECK_OPENCL_ERROR(status, "clEnqueueReadBuffer failed.");

        status = clFlush(commandQueue);
        CHECK_OPENCL_ERROR(status, "clFlush failed.");

        status = waitForEventAndRelease(&readEvt);
        CHECK_OPENCL_ERROR(status, "waitForEvent failed.");
    }

    // Enqueue readBuffer
    cl_event readEvt;
    status = clEnqueueReadBuffer(
                 commandQueue,
                 eigenIntervalBuffer[in],
                 CL_FALSE,
                 0,
                 length * 2 * sizeof(cl_uint),
                 eigenIntervals[in],
                 0,
                 NULL,
                 &readEvt);
    CHECK_OPENCL_ERROR(status, "clEnqueueReadBuffer failed.");

    status = clFlush(commandQueue);
    CHECK_OPENCL_ERROR(status, "clFlush failed.");

    status = waitForEventAndRelease(&readEvt);
    CHECK_OPENCL_ERROR(status, "waitForEvent failed.");

    return SDK_SUCCESS;
}

/*
 * function to calculate the gerschgorin interval(lowerbound and upperbound of the eigenvalues)
 *                                              of a tridiagonal symmetric matrix
 */
void
EigenValue::computeGerschgorinInterval(cl_float * lLimit,
                                       cl_float * uLimit,
                                       const cl_float * diagonal,
                                       const cl_float * offDiagonal,
                                       const cl_uint  length)
{

    cl_float lowerLimit = diagonal[0] - fabs(offDiagonal[0]);
    cl_float upperLimit = diagonal[0] + fabs(offDiagonal[0]);

    for(cl_uint i = 1; i < length-1; ++i)
    {
        float r =  fabs(offDiagonal[i-1]) + fabs(offDiagonal[i]);
        lowerLimit = (lowerLimit > (diagonal[i] - r))? (diagonal[i] - r): lowerLimit;
        upperLimit = (upperLimit < (diagonal[i] + r))? (diagonal[i] + r): upperLimit;
    }

    lowerLimit = (lowerLimit > (diagonal[length-1] - fabs(offDiagonal[length-2])))?
                 (diagonal[length-1] - fabs(offDiagonal[length-2])): lowerLimit;
    upperLimit = (upperLimit < (diagonal[length-1] + fabs(offDiagonal[length-2])))?
                 (diagonal[length-1] + fabs(offDiagonal[length-2])): upperLimit;

    *lLimit = lowerLimit;
    *uLimit = upperLimit;

}


/*
 * function to calculate the number of eigenvalues less than (x) for a tridiagonal symmetric matrix
 */

#ifdef WIN32
cl_uint
EigenValue::calNumEigenValuesLessThan(const cl_float *diagonal,
                                      const cl_float *offDiagonal,
                                      const cl_uint  length,
                                      const cl_float x)
#else
cl_uint
__attribute__ ((noinline)) EigenValue::calNumEigenValuesLessThan(const cl_float *diagonal,
                                      const cl_float *offDiagonal,
                                      const cl_uint  length,
                                      const cl_float x)
#endif
{
    cl_uint count = 0;

    float prev_diff = (diagonal[0] - x);
    count += (prev_diff < 0)? 1 : 0;
    for(cl_uint i = 1; i < length; i += 1)
    {
        float diff = (diagonal[i] - x) - ((offDiagonal[i-1] *
                                           offDiagonal[i-1])/prev_diff);

        count += (diff < 0)? 1 : 0;
        prev_diff = diff;
    }
    return count;
}

/*
 * Calculates the eigenvalues of a tridiagonal symmetrix matrix
 */
cl_uint
EigenValue::eigenValueCPUReference(cl_float * diagonal,
                                   cl_float * offDiagonal,
                                   cl_uint    length,
                                   cl_float * eigenIntervals,
                                   cl_float * newEigenIntervals)
{
    cl_uint offset = 0;
    for(cl_uint i =0; i < length; ++i)
    {
        cl_uint lid = 2*i;
        cl_uint uid = lid + 1;

        cl_uint eigenValuesLessLowerBound = calNumEigenValuesLessThan(diagonal,
                                            offDiagonal, length, eigenIntervals[lid]);
        cl_uint eigenValuesLessUpperBound = calNumEigenValuesLessThan(diagonal,
                                            offDiagonal, length, eigenIntervals[uid]);

        cl_uint numSubIntervals = eigenValuesLessUpperBound - eigenValuesLessLowerBound;

        if(numSubIntervals > 1)
        {
            cl_float avgSubIntervalWidth = (eigenIntervals[uid] -
                                            eigenIntervals[lid])/numSubIntervals;

            for(cl_uint j=0; j < numSubIntervals; ++j)
            {
                cl_uint newLid = 2* (offset+j);
                cl_uint newUid = newLid + 1;

                newEigenIntervals[newLid] = eigenIntervals[lid]       + j * avgSubIntervalWidth;
                newEigenIntervals[newUid] = newEigenIntervals[newLid] +     avgSubIntervalWidth;
            }
        }
        else if(numSubIntervals == 1)
        {
            cl_float lowerBound = eigenIntervals[lid];
            cl_float upperBound = eigenIntervals[uid];

            cl_float mid        = (lowerBound + upperBound)/2;

            cl_uint newLid = 2* offset;
            cl_uint newUid = newLid + 1;

            if(upperBound - lowerBound < tolerance)
            {
                newEigenIntervals[newLid] = lowerBound;
                newEigenIntervals[newUid] = upperBound;
            }
            else if(calNumEigenValuesLessThan(diagonal,offDiagonal, length,
                                              mid) == eigenValuesLessUpperBound)
            {
                newEigenIntervals[newLid] = lowerBound;
                newEigenIntervals[newUid] = mid;
            }
            else
            {
                newEigenIntervals[newLid] = mid;
                newEigenIntervals[newUid] = upperBound;
            }
        }
        offset += numSubIntervals;
    }
    return offset;
}

int
EigenValue::initialize()
{
    // Call base class Initialize to get default configuration
    if(sampleArgs->initialize())
    {
        return SDK_FAILURE;
    }

    // Now add customized options
    Option* diagonal_length = new Option;
    CHECK_ALLOCATION(diagonal_length, "Memory allocation error.\n");

    diagonal_length->_sVersion = "x";
    diagonal_length->_lVersion = "length";
    diagonal_length->_description = "Length of diagonal of the square matrix";
    diagonal_length->_type = CA_ARG_INT;
    diagonal_length->_value = &length;
    sampleArgs->AddOption(diagonal_length);
    delete diagonal_length;

    Option* num_iterations = new Option;
    CHECK_ALLOCATION(num_iterations, "Memory allocation error.\n");

    num_iterations->_sVersion = "i";
    num_iterations->_lVersion = "iterations";
    num_iterations->_description = "Number of iterations for kernel execution";
    num_iterations->_type = CA_ARG_INT;
    num_iterations->_value = &iterations;

    sampleArgs->AddOption(num_iterations);
    delete num_iterations;

    return SDK_SUCCESS;
}

int
EigenValue::setup()
{
    if(isPowerOf2(length))
    {
        length = roundToPowerOf2(length);
    }

    if(setupEigenValue()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    int timer = sampleTimer->createTimer();
    sampleTimer->resetTimer(timer);
    sampleTimer->startTimer(timer);

    if(setupCL()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    sampleTimer->stopTimer(timer);

    setupTime = (cl_double)sampleTimer->readTimer(timer);

    return SDK_SUCCESS;
}


int
EigenValue::run()
{
    // Warm up
    for(int i = 0; i < 2 && iterations != 1; i++)
    {
        // Arguments are set and execution call is enqueued on command buffer
        if(runCLKernels() != SDK_SUCCESS)
        {
            return SDK_FAILURE;
        }
    }

    std::cout << "Executing kernel for " << iterations
              << " iterations" << std::endl;
    std::cout << "-------------------------------------------" << std::endl;

    int timer = sampleTimer->createTimer();
    sampleTimer->resetTimer(timer);
    sampleTimer->startTimer(timer);

    for(int i = 0; i < iterations; i++)
    {
        // Arguments are set and execution call is enqueued on command buffer
        if(runCLKernels() != SDK_SUCCESS)
        {
            return SDK_FAILURE;
        }
    }

    sampleTimer->stopTimer(timer);
    totalKernelTime = (double)(sampleTimer->readTimer(timer)) / iterations;

    if(!sampleArgs->quiet)
    {
        printArray<cl_float>("Output", eigenIntervals[1], 2*length, 1);
    }

    return SDK_SUCCESS;
}

int
EigenValue::verifyResults()
{
    cl_uint offset = 0;
    if(sampleArgs->verify)
    {
        cl_uint eigenIntervalsSizeBytes = (2*length) * sizeof(cl_float);
        for(int i=0 ; i < 2; ++i)
        {
            verificationEigenIntervals[i] = (cl_float *) malloc(eigenIntervalsSizeBytes);

            if(verificationEigenIntervals[i] == NULL)
            {
                error("Failed to allocate host memory. (verificationEigenIntervals)");
                return SDK_FAILURE;
            }
        }

        cl_float lowerLimit;
        cl_float upperLimit;
        computeGerschgorinInterval(&lowerLimit, &upperLimit, diagonal, offDiagonal,
                                   length);

        verificationIn = 0;
        verificationEigenIntervals[verificationIn][0]= lowerLimit;
        verificationEigenIntervals[verificationIn][1]= upperLimit;

        for(cl_int i=2 ; i < 2*length ; i++)
        {
            verificationEigenIntervals[verificationIn][i] = upperLimit;
        }


        int refTimer = sampleTimer->createTimer();
        sampleTimer->resetTimer(refTimer);
        sampleTimer->startTimer(refTimer);

        while(isComplete(verificationEigenIntervals[verificationIn]))
        {
            offset = eigenValueCPUReference(diagonal,offDiagonal, length,
                                            verificationEigenIntervals[verificationIn],
                                            verificationEigenIntervals[1-verificationIn]);
            verificationIn = 1 - verificationIn;
        }

        sampleTimer->stopTimer(refTimer);
        referenceKernelTime = sampleTimer->readTimer(refTimer);

        if(compare(eigenIntervals[in], verificationEigenIntervals[verificationIn],
                   2*length))
        {
            std::cout<<"Passed!\n" << std::endl;
            return SDK_SUCCESS;
        }
        else
        {
            std::cout<<"Failed\n" << std::endl;
            return SDK_FAILURE;
        }
    }
    return SDK_SUCCESS;
}

void
EigenValue::printStats()
{
    if(sampleArgs->timing)
    {
        std::string strArray[3] = {"DiagonalLength", "Time(sec)", "[Transfer+Kernel]Time(sec)"};
        std::string stats[3];

        sampleTimer->totalTime = setupTime + totalKernelTime;

        stats[0] = toString(length, std::dec);
        stats[1] = toString(sampleTimer->totalTime, std::dec);
        stats[2] = toString(totalKernelTime, std::dec);

        printStatistics(strArray, stats, 3);
    }
}

int
EigenValue::cleanup()
{
    // Releases OpenCL resources (Context, Memory etc.)
    cl_int status;

    for(cl_uint i=0; i < 2; ++i)
    {
        status = clReleaseKernel(kernel[i]);
        CHECK_OPENCL_ERROR(status, "clReleaseKernel failed.");
    }

    status = clReleaseProgram(program);
    CHECK_OPENCL_ERROR(status, "clReleaseProgram failed.(program)");

    status = clReleaseMemObject(diagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clReleaseMemObject failed.(diagonalBuffer)");

    status = clReleaseMemObject(offDiagonalBuffer);
    CHECK_OPENCL_ERROR(status, "clReleaseMemObject failed.(offDiagonalBuffer)");

    status = clReleaseMemObject(eigenIntervalBuffer[0]);
    CHECK_OPENCL_ERROR(status,
                       "clReleaseMemObject failed.(eigenIntervalBuffer[0])");

    status = clReleaseMemObject(eigenIntervalBuffer[1]);
    CHECK_OPENCL_ERROR(status,
                       "clReleaseMemObject failed.(eigenIntervalBuffer[1])");

    status = clReleaseMemObject(numEigenValuesIntervalBuffer);
    CHECK_OPENCL_ERROR(status,
                       "clReleaseMemObject failed.(numEigenValuesIntervalBuffer)");

    status = clReleaseCommandQueue(commandQueue);
    CHECK_OPENCL_ERROR(status, "clReleaseCommandQueue failed.(commandQueue)");

    status = clReleaseContext(context);
    CHECK_OPENCL_ERROR(status, "clReleaseContext failed.(context)");

    // release program resources (input memory etc.)
    FREE(diagonal);
    FREE(offDiagonal);
    FREE(eigenIntervals[0]);
    FREE(eigenIntervals[1]);
    FREE(verificationEigenIntervals[0]);
    FREE(verificationEigenIntervals[1]);
    FREE(devices);
    return SDK_SUCCESS;
}

int
main(int argc, char * argv[])
{
    EigenValue clEigenValue;

    // Initialize
    if(clEigenValue.initialize() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }
    if(clEigenValue.sampleArgs->parseCommandLine(argc, argv))
    {
        return SDK_FAILURE;
    }

    if(clEigenValue.sampleArgs->isDumpBinaryEnabled())
    {
        return clEigenValue.genBinaryImage();
    }
    // Setup
    if(clEigenValue.setup()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }
    // Run
    if(clEigenValue.run()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    // VerifyResults
    if(clEigenValue.verifyResults()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }
    // Cleanup
    if(clEigenValue.cleanup()!=SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }
    clEigenValue.printStats();

    return SDK_SUCCESS;
}
