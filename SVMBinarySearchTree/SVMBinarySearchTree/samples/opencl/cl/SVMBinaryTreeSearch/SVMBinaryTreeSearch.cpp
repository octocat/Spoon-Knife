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


#include "SVMBinaryTreeSearch.hpp"

int SVMBinaryTreeSearch::setupSVMBinaryTree()
{

  /* setup number of keys */
  if(numKeys == 0)
    numKeys = (int)(numNodes*SEARCH_KEY_NODE_RATIO);

  /* if localRandMax GT RAND_MAX set it to RAND_MAX */
  if(localRandMax > RAND_MAX)
    localRandMax = RAND_MAX;

  /* initialize random number generator */
  if(localSeed == 0)
    srand((unsigned int)time(NULL));
  else
    srand(localSeed);


  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::setupCL(void)
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
  
  // Get platform
  cl_platform_id platform = NULL;
  int retValue = getPlatform(platform, sampleArgs->platformId,
			     sampleArgs->isPlatformEnabled());
  CHECK_ERROR(retValue, SDK_SUCCESS, "getPlatform() failed");
  
  // Display available devices.
  retValue = displayDevices(platform, dType);
  CHECK_ERROR(retValue, SDK_SUCCESS, "displayDevices() failed");
    
  // If we could find our platform, use it. Otherwise use just available 
  // platform.
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
  
  status = getDevices(context, &devices, sampleArgs->deviceId,
		      sampleArgs->isDeviceIdEnabled());
  CHECK_ERROR(status, SDK_SUCCESS, "getDevices() failed");
  
  //Set device info of given cl_device_id
  status = deviceInfo.setDeviceInfo(devices[sampleArgs->deviceId]);
  CHECK_ERROR(status, SDK_SUCCESS, "SDKDeviceInfo::setDeviceInfo() failed");
  
  //Check OpenCL 2.x compliance
  bool checkOCLversion = deviceInfo.checkOpenCL2_XCompatibility();
  
  if (!checkOCLversion) 
  {
	OPENCL_EXPECTED_ERROR("Unsupported device! Required CL_DEVICE_OPENCL_C_VERSION 2.0 or higher");
  }
  

  // Create command queue
  cl_queue_properties prop[] = {0};
  commandQueue = clCreateCommandQueueWithProperties(
                    context,
		    devices[sampleArgs->deviceId],
		    prop,
		    &status);
  CHECK_OPENCL_ERROR(status, "clCreateCommandQueue failed.");

  // create a CL program using the kernel source
  buildProgramData buildData;
  buildData.kernelName = std::string("SVMBinaryTreeSearch_Kernels.cl");
  buildData.devices = devices;
  buildData.deviceId = sampleArgs->deviceId;
  buildData.flagsStr = std::string("");
  
  if(sampleArgs->isLoadBinaryEnabled())
    {
      buildData.binaryName = std::string(sampleArgs->loadBinary.c_str());
    }

  if(sampleArgs->isComplierFlagsSpecified())
    {
      buildData.flagsFileName = std::string(sampleArgs->flags.c_str());
    }

  retValue = buildOpenCLProgram(program, context, buildData);
  CHECK_ERROR(retValue, SDK_SUCCESS, "buildOpenCLProgram() failed");

  // get a kernel object handle for a kernel with the given name
  sample_kernel = clCreateKernel(program, "sample_kernel", &status);
  CHECK_OPENCL_ERROR(status, "clCreateKernel::sample_kernel failed.");

  // initialize any device/SVM memory here.
  svmTreeBuf = clSVMAlloc(context,
			  CL_MEM_READ_WRITE,
			  numNodes*sizeof(node),
			  0);
  
  if(NULL == svmTreeBuf)
    retValue = SDK_FAILURE;

  CHECK_ERROR(retValue, SDK_SUCCESS, "clSVMAlloc(svmTreeBuf) failed.");  

  svmSearchBuf = clSVMAlloc(context,
			    CL_MEM_READ_WRITE,
			    numKeys*sizeof(searchKey),
			    0);

  if(NULL == svmSearchBuf)
    retValue = SDK_FAILURE;

  CHECK_ERROR(retValue, SDK_SUCCESS, "clSVMAlloc(svmSearchBuf) failed.");  

  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::genBinaryImage()
{
    bifData binaryData;
    binaryData.kernelName = std::string("SVMBinaryTree_Kernels.cl");
    binaryData.flagsStr = std::string("");
    if(sampleArgs->isComplierFlagsSpecified())
    {
      binaryData.flagsFileName = std::string(sampleArgs->flags.c_str());
    }
    binaryData.binaryName = std::string(sampleArgs->dumpBinary.c_str());
    int status = generateBinaryImage(binaryData);
    return status;
}

int SVMBinaryTreeSearch::runCLKernels(void)
{
    cl_int status;

    status =  kernelInfo.setKernelWorkGroupInfo(sample_kernel,
              devices[sampleArgs->deviceId]);
    CHECK_ERROR(status, SDK_SUCCESS, "setKErnelWorkGroupInfo() failed");

    /* run global kernels for stage decided by input length */
    status = runSampleKernel();

    return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::runSampleKernel()
{
    size_t localThreads  = kernelInfo.kernelWorkGroupSize;
    size_t globalThreads = numKeys;

    // Set appropriate arguments to the kernel
    int status = clSetKernelArgSVMPointer(sample_kernel,
					  0,
					  (void *)(svmTreeBuf));
    CHECK_OPENCL_ERROR(status, "clSetKernelArgSVMPointer(svmTreeBuf) failed.");

    status = clSetKernelArgSVMPointer(sample_kernel,
				      1,
				      (void *)(svmSearchBuf));
    CHECK_OPENCL_ERROR(status,"clSetKernelArgSVMPointer(svmSearchBuf) failed.");

    // Enqueue a kernel run call
    cl_event ndrEvt;
    status = clEnqueueNDRangeKernel(
                 commandQueue,
                 sample_kernel,
                 1,
                 NULL,
                 &globalThreads,
                 &localThreads,
                 0,
                 NULL,
                 &ndrEvt);
    CHECK_OPENCL_ERROR(status, "clEnqueueNDRangeKernel failed.");

    status = clFlush(commandQueue);
    CHECK_OPENCL_ERROR(status, "clFlush failed.(commandQueue)");

    status = clFinish(commandQueue);
    CHECK_OPENCL_ERROR(status, "clFinish failed.(commandQueue)");

    return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::svmBinaryTreeCPUReference()
{
  searchKey* keyPtr        = (searchKey*)svmSearchBuf;
  searchKey* currKey       = keyPtr;
  node*      searchNode    = svmRoot;
  int        status        = SDK_SUCCESS;

  /* reserve svm buffers for cpu usage */
  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_READ,
			   svmTreeBuf,
			   numNodes*sizeof(node),
			   0,
			   NULL,
			   NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap(svmTreeBuf) failed.");

  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_WRITE,
			   svmSearchBuf,
			   numKeys*sizeof(searchKey),
			   0,
			   NULL,
			   NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap(svmSearchBuf) failed.");


  for(int i = 0; i < numKeys; ++i)
    {
      /* search tree */
      searchNode    = svmRoot;

      while(NULL != searchNode)
	{
	  if(currKey->key == searchNode->value)
	    {
	      /* rejoice on finding key */
	      currKey->nativeNode = searchNode;
	      searchNode          = NULL;
	    }
	  else if(currKey->key < searchNode->value)
	    {
	      /* move left */
	      searchNode = searchNode->left;
	    }
	  else
	    {
	      /* move right */
	      searchNode = searchNode->right;
	    }
	}

      /* move to next key */
      currKey += 1;
    } 

  status = clEnqueueSVMUnmap(commandQueue,
			     svmSearchBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap(svmSearchBuf) failed.");

  status = clEnqueueSVMUnmap(commandQueue,
			     svmTreeBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap(svmTreeBuf) failed.");

  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::initialize()
{
  // Call base class Initialize to get default configuration
  if(sampleArgs->initialize() != SDK_SUCCESS)
    {
      return SDK_FAILURE;
    }
  
  Option* new_option = new Option;
  CHECK_ALLOCATION(new_option, "Memory allocation error. (new_option)");
  
  new_option->_sVersion = "i";
  new_option->_lVersion = "iterations";
  new_option->_description = "Number of iterations for kernel execution";
  new_option->_type = CA_ARG_INT;
  new_option->_value = &iterations;
  
  sampleArgs->AddOption(new_option);

  new_option->_sVersion = "n";
  new_option->_lVersion = "nodes";
  new_option->_description = "Number of nodes in binary tree.";
  new_option->_type = CA_ARG_INT;
  new_option->_value = &numNodes;
  sampleArgs->AddOption(new_option);

  new_option->_sVersion = "k";
  new_option->_lVersion = "keys";
  new_option->_description = "Number of keys to be searched.";
  new_option->_type = CA_ARG_INT;
  new_option->_value = &numKeys;
  sampleArgs->AddOption(new_option);

  new_option->_sVersion = "r";
  new_option->_lVersion = "randMax";
  new_option->_description = "Maximum random number value(0 to randMax).";
  new_option->_type = CA_ARG_INT;
  new_option->_value = &localRandMax;
  sampleArgs->AddOption(new_option);

  new_option->_sVersion = "s";
  new_option->_lVersion = "seed";
  new_option->_description = "Seed to random number generator(0 indicates internal seed).";
  new_option->_type = CA_ARG_INT;
  new_option->_value = &localSeed;
  sampleArgs->AddOption(new_option);
  
  delete new_option;
  
  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::setup()
{
  if(setupSVMBinaryTree() != SDK_SUCCESS)
    {
      return SDK_FAILURE;
    }
  
  int timer = sampleTimer->createTimer();
  sampleTimer->resetTimer(timer);
  sampleTimer->startTimer(timer);
  
  if (setupCL() != SDK_SUCCESS)
    {
      return SDK_FAILURE;
    }
  
  sampleTimer->stopTimer(timer);
  setupTime = (cl_double)sampleTimer->readTimer(timer);

  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::run()
{
    int status = 0;

    //create the binary tree
    status = cpuCreateBinaryTree();
    CHECK_ERROR(status, SDK_SUCCESS, "cpuCreateBinaryTree() failed.");

    //initialize search keys
    status = cpuInitSearchKeys();
    CHECK_ERROR(status, SDK_SUCCESS, "cpuInitSearchKeys() failed.");

    /* if voice is not deliberately muzzled, shout parameters */
    if(!sampleArgs->quiet)
      {
	std::cout << "--------------------------------------------------";
	std::cout << "-----------------------" << std::endl;
	std::cout << "Searching " << numKeys << " keys in  a BST having ";
	std::cout << numNodes << " Nodes..." << std::endl;
	std::cout << "--------------------------------------------------";
	std::cout << "-----------------------" << std::endl;

      }  

    //warm up run
    if(runCLKernels() != SDK_SUCCESS)
      {
	return SDK_FAILURE;
      }
    
    std::cout << "-------------------------------------------" << std::endl;
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
    kernelTime = (double)(sampleTimer->readTimer(timer));

    return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::verifyResults()
{
  int status = SDK_SUCCESS;
  if(sampleArgs->verify)
    {
      // reference implementation
      svmBinaryTreeCPUReference();
      
      // compare the results and see if they match
      status = compare();
      if(SDK_SUCCESS == status)
        {
	  std::cout << "Passed!\n" << std::endl;
        }
      else
	{
	  std::cout << "Failed\n" << std::endl;
	}
    }
  return status;
}

void SVMBinaryTreeSearch::printStats()
{
    if(sampleArgs->timing)
    {
        std::string strArray[3] =
        {
            "Setup Time(sec)",
            "Avg. kernel time (sec)",
	    "nodes searched/sec"
        };
        std::string stats[3];
        double avgKernelTime = kernelTime / iterations;
	double nodesPerSec   = (double)numKeys/avgKernelTime;

        stats[0] = toString(setupTime, std::dec);
        stats[1] = toString(avgKernelTime, std::dec);
        stats[2] = toString(nodesPerSec, std::dec);

        printStatistics(strArray, stats, 3);
    }
}

int SVMBinaryTreeSearch::cleanup()
{
    // Releases OpenCL resources (Context, Memory etc.)
    cl_int status = 0;

    clSVMFree(context,svmTreeBuf);

    status = clReleaseKernel(sample_kernel);
    CHECK_OPENCL_ERROR(status, "clReleaseKernel failed.(sample_kernel)");

    status = clReleaseProgram(program);
    CHECK_OPENCL_ERROR(status, "clReleaseProgram failed.(program)");

    status = clReleaseCommandQueue(commandQueue);
    CHECK_OPENCL_ERROR(status, "clReleaseCommandQueue failed.(commandQueue)");

    status = clReleaseContext(context);
    CHECK_OPENCL_ERROR(status, "clReleaseContext failed.(context)");

    return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::lrand()
{
  float frand;

  /* generate a real random number between 0 and 1.0 */
  frand = (float)rand()/(float)(RAND_MAX);

  /* convert to the range needed */
  return (int)(frand*localRandMax);
}

/**
 * cpuCreateBinaryTree()
 * creates a tree from the data in "svmTreeBuf". If this is NULL returns NULL
 * else returns root of the tree. 
 **/
int SVMBinaryTreeSearch::cpuCreateBinaryTree()
{
  node*    root;
  cl_int   status;

  /* reserve svm space for CPU update */
  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_WRITE_INVALIDATE_REGION,
			   svmTreeBuf,
			   numNodes*sizeof(node),
			   0,
			   NULL,
			   NULL);

  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap(svmTreeBuf) failed.");

  status = cpuInitNodes();
  CHECK_ERROR(status, SDK_SUCCESS, "cpuInitNodes() failed.");

  root   = cpuMakeBinaryTree();
  
  status = clEnqueueSVMUnmap(commandQueue,
			     svmTreeBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap(svmTreeBuf) failed.");

  /* set the root */
  svmRoot = root;

  return SDK_SUCCESS;
}

node* SVMBinaryTreeSearch::cpuMakeBinaryTree()
{
  node* root = NULL;
  node* data;
  node* nextData;
  node* nextNode;
  bool  insertedFlag = false;

  if (NULL != svmTreeBuf)
    {
      /* allocate first node to root */
      data     = (node *)svmTreeBuf;
      nextData = data;
      root     = nextData;

      /* iterative tree insert */
      for (int i = 1; i < numNodes; ++i)
	{
	  nextData = nextData + 1;

	  nextNode     = root;
	  insertedFlag = false;
	  
	  while(false == insertedFlag)
	    {
	      if(nextData->value <= nextNode->value)
		{
		  /* move left */
		  if(NULL == nextNode->left)
		    {
		      nextNode->left   = nextData;
		      insertedFlag     = true;
		    }
		  else
		    {
		      nextNode = nextNode->left;
		    }
		}
	      else
		{
		  /* move right */
		  if(NULL == nextNode->right)
		    {
		      nextNode->right  = nextData;
		      insertedFlag     = true;
		    }
		  else
		    {
		      nextNode = nextNode->right;
		    }
		}
	    }
	}
    }

  return root;
}

int SVMBinaryTreeSearch::cpuInitNodes()
{
  node* nextData;

  if (NULL != svmTreeBuf)
    {
      /* get the first node */
      nextData = (node *)svmTreeBuf;

      /* initialize nodes */
      for (int i = 0; i < numNodes; ++i)
	{
	  /* allocate a random value to node */
	  nextData->value  = lrand();

	  /* all pointers are null */
	  nextData->left   = NULL;
	  nextData->right  = NULL;

	  nextData = nextData + 1;
	}
    }
  else
    {
      return SDK_FAILURE;
    }

  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::cpuInitSearchKeys()
{
  searchKey* nextData;
  int        status = SDK_SUCCESS;

  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_WRITE_INVALIDATE_REGION,
			   svmSearchBuf,
			   numKeys*sizeof(searchKey),
			   0,
			   NULL,
			   NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap(svmSearchBuf) failed.");

  if (NULL != svmSearchBuf)
    {
      /* get the first node */
      nextData = (searchKey *)svmSearchBuf;

      /* initialize nodes */
      for (int i = 0; i < numKeys; ++i)
	{
	  /* allocate a random value to node */
	  nextData->key        = lrand();
	  nextData->oclNode    = NULL;
	  nextData->nativeNode = NULL;

	  nextData = nextData + 1;
	}
    }
  else
    {
      status =  SDK_FAILURE;
    }

  status = clEnqueueSVMUnmap(commandQueue,
			     svmSearchBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap(svmSearchBuf) failed.");

  return status;
}

int SVMBinaryTreeSearch::compare()
{
  searchKey* keyPtr         = (searchKey*)svmSearchBuf;
  searchKey* currKey        = keyPtr;
  int        compare_status = SDK_SUCCESS;
  int        status;

  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_WRITE_INVALIDATE_REGION,
			   svmSearchBuf,
			   numKeys*sizeof(searchKey),
			   0,
			   NULL,
			   NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap(svmSearchBuf) failed.");

  for(int i = 0; i < numKeys; ++i)
    {
      /* compare OCL and native nodes */
      if(currKey->oclNode != currKey->nativeNode)
	{
	  compare_status = SDK_FAILURE;
	}

      /* next key */
      currKey += 1;
    }


  status = clEnqueueSVMUnmap(commandQueue,
			     svmSearchBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap(svmSearchBuf) failed.");

  return compare_status;
}


int SVMBinaryTreeSearch::printInOrder()
{
  cl_int status;

  /* reserve svm space for CPU update */
  status = clEnqueueSVMMap(commandQueue,
			   CL_TRUE, //blocking call
			   CL_MAP_READ,
			   svmTreeBuf,
			   numNodes*sizeof(node),
			   0,
			   NULL,
			   NULL);

  CHECK_OPENCL_ERROR(status, "clEnqueueSVMMap failed.");

  status  = recursiveInOrder(svmRoot);
  CHECK_ERROR(status, SDK_SUCCESS,"recursiveInOrder failed.");

  status = clEnqueueSVMUnmap(commandQueue,
			     svmTreeBuf,
			     0,
			     NULL,
			     NULL);
  CHECK_OPENCL_ERROR(status, "clEnqueueSVMUnmap failed.");

  return SDK_SUCCESS;
}

int SVMBinaryTreeSearch::recursiveInOrder(node* leaf)
{
  if(NULL != leaf)
    {
      recursiveInOrder(leaf->left);
      std::cout << leaf->value << ", ";
      recursiveInOrder(leaf->right);
    }

  return SDK_SUCCESS;
}



int main(int argc, char * argv[])
{
    SVMBinaryTreeSearch clSVMBinaryTree;

    // Initialize
    if(clSVMBinaryTree.initialize() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    if(clSVMBinaryTree.sampleArgs->parseCommandLine(argc, argv) != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    if(clSVMBinaryTree.sampleArgs->isDumpBinaryEnabled())
    {
        //GenBinaryImage
        return clSVMBinaryTree.genBinaryImage();
    }

    // Setup
    if(clSVMBinaryTree.setup() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    // Run
    if(clSVMBinaryTree.run() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    // VerifyResults
    if(clSVMBinaryTree.verifyResults() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    // Cleanup
    if (clSVMBinaryTree.cleanup() != SDK_SUCCESS)
    {
        return SDK_FAILURE;
    }

    clSVMBinaryTree.printStats();
    return SDK_SUCCESS;
}
