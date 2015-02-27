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


#ifndef EIGENVALUE_H_
#define EIGENVALUE_H_




/**
 * Header Files
 */
#include <CL/cl.h>
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <string.h>
#include "CLUtil.hpp"

#define SAMPLE_VERSION "AMD-APP-SDK-v3.0.113.2"

using namespace appsdk;

/**
 * EigenValue
 * Class implements OpenCL  EigenValue sample
 */

class EigenValue
{
        cl_uint
        seed;        /**< Seed value for random number generation */
        cl_double              setupTime;    /**< Time for setting up OpenCL */
        cl_double    totalKernelTime;        /**< Time for kernel execution */
        cl_double    totalProgramTime;       /**< Time for program execution */
        cl_double referenceKernelTime;       /**< Time for reference implementation */
        cl_float epsilon;
        cl_float tolerance;
        cl_int   length;                     /**< Length of the diagonal of the square matrix */
        cl_float *diagonal;                  /**< diagonal elements of the matrix */
        cl_float *offDiagonal;               /**< off-diagonal elements of the matrix */
        cl_float *eigenIntervals[2];         /**< calculated eigen values of the matrix */
        cl_uint  in;
        cl_float *verificationEigenIntervals[2];/**< eigen values using reference implementation */
        cl_uint   verificationIn;
        cl_context context;                 /**< CL context */
        cl_device_id *devices;              /**< CL device list */
        cl_mem   diagonalBuffer;            /**< CL diagonal memory buffer */
        cl_mem   offDiagonalBuffer;         /**< CL offDiagonal memory buffer */
        cl_mem   eigenIntervalBuffer[2];    /**< CL eigenInterval memory buffer */
        cl_mem   numEigenValuesIntervalBuffer;/**< CL number of eigenvalues in an interval memory buffer */
        cl_command_queue commandQueue;      /**< CL command queue */
        cl_program program;                 /**< CL program  */
        cl_kernel kernel[2];                /**< CL kernel */
        int       iterations;               /**< Number of iterations for kernel execution */
        size_t globalThreads[1];            /**< global NDRange */
        size_t localThreads[1];             /**< local WorkGroup Size */
        KernelWorkGroupInfo
        kernelInfo;          /**< Structure to store kernel related info */

        SDKTimer *sampleTimer;      /**< SDKTimer object */

    public:

        CLCommandArgs   *sampleArgs;   /**< CLCommand argument class */

        /**
         * Constructor
         * Initialize member variables
         */
        EigenValue()
        {
            sampleArgs = new CLCommandArgs();
            sampleTimer = new SDKTimer();
            sampleArgs->sampleVerStr = SAMPLE_VERSION;
            seed = 123;
            length = 1024;
            diagonal = NULL;
            offDiagonal = NULL;
            eigenIntervals[0] = NULL;
            eigenIntervals[1] = NULL;
            verificationEigenIntervals[0] = NULL;
            verificationEigenIntervals[1] = NULL;
            setupTime = 0;
            totalKernelTime = 0;
            iterations = 1;
        }

        void computeGerschgorinInterval(cl_float * lowerLimit,
                                        cl_float * upperLimit,
                                        const cl_float * diagonal,
                                        const cl_float * offDiagonal,
                                        const cl_uint  width);

        int isComplete(cl_float * eigenIntervals);
        /**
         * Allocate and initialize host memory array with random values
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int setupEigenValue();

        /**
         * Calculates the value of WorkGroup Size based in global NDRange
         * and kernel properties
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int setWorkGroupSize();

        /**
         * Override from SDKSample, Generate binary image of given kernel
         * and exit application
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int genBinaryImage();

        /**
         * OpenCL related initialisations.
         * Set up Context, Device list, Command Queue, Memory buffers
         * Build CL kernel program executable
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int setupCL();

        /**
         * Set values for kernels' arguments, enqueue calls to the kernels
         * on to the command queue, wait till end of kernel execution.
         * Get kernel start and end time if timing is enabled
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int runCLKernels();

        /**
         * Reference CPU implementation of EigenValues calculation
         * for performance comparison
         * @param diagonal       Diagonal elements of hte tridiagonal symmetric matrix
         * @param offDiagonal    offDiagonal elements of the tridiagonal symmetric matrix
         * @param width          width of the square matrix
         * @param eigenIntervals Original eigenIntervals between which the eigenvalues exist
         * @param eigenIntervals recalculated eigenIntervals such that the number of eigenvalues
         *                       in an interval comes down to 1 eventually
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        cl_uint eigenValueCPUReference(cl_float * diagonal,
                                       cl_float * offDiagonal,
                                       cl_uint    width,
                                       cl_float * eigenIntervals,
                                       cl_float * newEigenIntervals);

        /**
         * Override from SDKSample. Print sample stats.
         */
        void printStats();

        /**
         * Override from SDKSample. Initialize
         * command line parser, add custom options
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int initialize();

        /**
         * Override from SDKSample, adjust width and height
         * of execution domain, perform all sample setup
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int setup();

        /**
         * Override from SDKSample
         * Run OpenCL EigenValue Sample
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int run();

        /**
         * Override from SDKSample
         * Cleanup memory allocations
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int cleanup();

        /**
         * Override from SDKSample
         * Verify against reference implementation
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        int verifyResults();

        /**
         * function to calculate the number of eigenvalues less than (x)
         * for a tridiagonal symmetric matrix
         * @param diagonal      diagonal elements of the matrix
         * @param offDiagonal   offDiagonal elements of the matrix
         * @param width         size of the square matrix
         * @param x             number of eigen values less than x
         * @return number of eigenvalues of the matrix less than x
         * @return SDK_SUCCESS on success and SDK_FAILURE on failure
         */
        cl_uint calNumEigenValuesLessThan(const cl_float *diagonal,
                                          const cl_float *offDiagonal,
                                          const cl_uint  width,
                                          const cl_float x);

};


#endif
