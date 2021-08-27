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
//
// Copyright (c) 2008 Advanced Micro Devices, Inc. All rights reserved.
//


#ifndef CLSample_H_
#define CLSample_H_

#include <CL/opencl.h>

#include "SDKUtil.hpp"
#include "SDKFile.hpp"

#define ASSERT_CL_RETURN( actual , msg)\
   if( checkVal(actual, CL_SUCCESS, msg) )\
   {\
	  std::cout << "Location : " << __FILE__ << ":" << __LINE__<< std::endl; \
      exit(SDK_FAILURE);\
   }

#define CHECK_OPENCL_ERROR(actual, msg) \
    if(checkVal(actual, CL_SUCCESS, msg)) \
    { \
        std::cout << "Location : " << __FILE__ << ":" << __LINE__<< std::endl; \
        return SDK_FAILURE; \
    }

#define OPENCL_EXPECTED_ERROR(msg) \
    { \
        expectedError(msg); \
        return SDK_EXPECTED_FAILURE; \
    }

#define CHECK_OPENVIDEO_ERROR(actual, msg) \
    if(checkVal(actual, CL_SUCCESS, msg)) \
    { \
        std::cout << "Location : " << __FILE__ << ":" << __LINE__<< std::endl; \
        return SDK_FAILURE; \
    }

#define OPENVIDEO_EXPECTED_ERROR(msg) \
    { \
        expectedError(msg); \
        return SDK_EXPECTED_FAILURE; \
    }

#define UNUSED(expr) (void)(expr);


/**
 * GLOBAL DEFINED Macros
 */
#define CL_CONTEXT_OFFLINE_DEVICES_AMD        0x403F


namespace appsdk
{

/**
 * bifData
 * struct to generate/load binary functionality
 */
struct bifData
{
    std::string kernelName;         /**< kernelName name of the kernel */
    std::string flagsFileName;      /**< flagFileName flags file for the kernel */
    std::string flagsStr;           /**< flagsStr flags string */
    std::string binaryName;         /**< binaryName name of the binary */

    /**
     * Constructor
     */
    bifData()
    {
        kernelName = std::string("");
        flagsFileName = std::string("");
        flagsStr = std::string("");
        binaryName = std::string("");
    }
};

/**
 * buildProgramData
 * struct to build the kernel
 */
struct buildProgramData
{
    std::string kernelName;             /**< kernelName name of the kernel */
    std::string
    flagsFileName;          /**< flagFileName name of the file of flags */
    std::string flagsStr;               /**< flagsStr flags string */
    std::string binaryName;             /**< binaryName name of the binary */
    cl_device_id*
    devices;              /**< devices array of device to build kernel for */
    int deviceId;                       /**< deviceId Id of the device to buid kernel for */

    /**
     * Constructor
     */
    buildProgramData()
    {
        kernelName = std::string("");
        flagsFileName = std::string("");
        flagsStr = std::string("");
        binaryName = std::string("");
    }
};

/**
 * getOpencLErrorCodeStr
 * global function to get corrosponding string for a error code
 * @param input Templated the error code
 * @return const char* the string for the error code
 */
static const char* getOpenCLErrorCodeStr(std::string input)
{
    return "unknown error code";
}

template<typename T>
static const char* getOpenCLErrorCodeStr(T input)
{
    int errorCode = (int)input;
    switch(errorCode)
    {
    case CL_DEVICE_NOT_FOUND:
        return "CL_DEVICE_NOT_FOUND";
    case CL_DEVICE_NOT_AVAILABLE:
        return "CL_DEVICE_NOT_AVAILABLE";
    case CL_COMPILER_NOT_AVAILABLE:
        return "CL_COMPILER_NOT_AVAILABLE";
    case CL_MEM_OBJECT_ALLOCATION_FAILURE:
        return "CL_MEM_OBJECT_ALLOCATION_FAILURE";
    case CL_OUT_OF_RESOURCES:
        return "CL_OUT_OF_RESOURCES";
    case CL_OUT_OF_HOST_MEMORY:
        return "CL_OUT_OF_HOST_MEMORY";
    case CL_PROFILING_INFO_NOT_AVAILABLE:
        return "CL_PROFILING_INFO_NOT_AVAILABLE";
    case CL_MEM_COPY_OVERLAP:
        return "CL_MEM_COPY_OVERLAP";
    case CL_IMAGE_FORMAT_MISMATCH:
        return "CL_IMAGE_FORMAT_MISMATCH";
    case CL_IMAGE_FORMAT_NOT_SUPPORTED:
        return "CL_IMAGE_FORMAT_NOT_SUPPORTED";
    case CL_BUILD_PROGRAM_FAILURE:
        return "CL_BUILD_PROGRAM_FAILURE";
    case CL_MAP_FAILURE:
        return "CL_MAP_FAILURE";
    case CL_MISALIGNED_SUB_BUFFER_OFFSET:
        return "CL_MISALIGNED_SUB_BUFFER_OFFSET";
    case CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST:
        return "CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST";
    case CL_INVALID_VALUE:
        return "CL_INVALID_VALUE";
    case CL_INVALID_DEVICE_TYPE:
        return "CL_INVALID_DEVICE_TYPE";
    case CL_INVALID_PLATFORM:
        return "CL_INVALID_PLATFORM";
    case CL_INVALID_DEVICE:
        return "CL_INVALID_DEVICE";
    case CL_INVALID_CONTEXT:
        return "CL_INVALID_CONTEXT";
    case CL_INVALID_QUEUE_PROPERTIES:
        return "CL_INVALID_QUEUE_PROPERTIES";
    case CL_INVALID_COMMAND_QUEUE:
        return "CL_INVALID_COMMAND_QUEUE";
    case CL_INVALID_HOST_PTR:
        return "CL_INVALID_HOST_PTR";
    case CL_INVALID_MEM_OBJECT:
        return "CL_INVALID_MEM_OBJECT";
    case CL_INVALID_IMAGE_FORMAT_DESCRIPTOR:
        return "CL_INVALID_IMAGE_FORMAT_DESCRIPTOR";
    case CL_INVALID_IMAGE_SIZE:
        return "CL_INVALID_IMAGE_SIZE";
    case CL_INVALID_SAMPLER:
        return "CL_INVALID_SAMPLER";
    case CL_INVALID_BINARY:
        return "CL_INVALID_BINARY";
    case CL_INVALID_BUILD_OPTIONS:
        return "CL_INVALID_BUILD_OPTIONS";
    case CL_INVALID_PROGRAM:
        return "CL_INVALID_PROGRAM";
    case CL_INVALID_PROGRAM_EXECUTABLE:
        return "CL_INVALID_PROGRAM_EXECUTABLE";
    case CL_INVALID_KERNEL_NAME:
        return "CL_INVALID_KERNEL_NAME";
    case CL_INVALID_KERNEL_DEFINITION:
        return "CL_INVALID_KERNEL_DEFINITION";
    case CL_INVALID_KERNEL:
        return "CL_INVALID_KERNEL";
    case CL_INVALID_ARG_INDEX:
        return "CL_INVALID_ARG_INDEX";
    case CL_INVALID_ARG_VALUE:
        return "CL_INVALID_ARG_VALUE";
    case CL_INVALID_ARG_SIZE:
        return "CL_INVALID_ARG_SIZE";
    case CL_INVALID_KERNEL_ARGS:
        return "CL_INVALID_KERNEL_ARGS";
    case CL_INVALID_WORK_DIMENSION:
        return "CL_INVALID_WORK_DIMENSION";
    case CL_INVALID_WORK_GROUP_SIZE:
        return "CL_INVALID_WORK_GROUP_SIZE";
    case CL_INVALID_WORK_ITEM_SIZE:
        return "CL_INVALID_WORK_ITEM_SIZE";
    case CL_INVALID_GLOBAL_OFFSET:
        return "CL_INVALID_GLOBAL_OFFSET";
    case CL_INVALID_EVENT_WAIT_LIST:
        return "CL_INVALID_EVENT_WAIT_LIST";
    case CL_INVALID_EVENT:
        return "CL_INVALID_EVENT";
    case CL_INVALID_OPERATION:
        return "CL_INVALID_OPERATION";
    case CL_INVALID_GL_OBJECT:
        return "CL_INVALID_GL_OBJECT";
    case CL_INVALID_BUFFER_SIZE:
        return "CL_INVALID_BUFFER_SIZE";
    case CL_INVALID_MIP_LEVEL:
        return "CL_INVALID_MIP_LEVEL";
    case CL_INVALID_GLOBAL_WORK_SIZE:
        return "CL_INVALID_GLOBAL_WORK_SIZE";
    case CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR:
        return "CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR";
    case CL_PLATFORM_NOT_FOUND_KHR:
        return "CL_PLATFORM_NOT_FOUND_KHR";
        //case CL_INVALID_PROPERTY_EXT:
        //    return "CL_INVALID_PROPERTY_EXT";
    case CL_DEVICE_PARTITION_FAILED_EXT:
        return "CL_DEVICE_PARTITION_FAILED_EXT";
    case CL_INVALID_PARTITION_COUNT_EXT:
        return "CL_INVALID_PARTITION_COUNT_EXT";

    default:
        return "unknown error code";
    }
}

/**
        * checkVal
        * Set default(isAPIerror) parameter to false
        * if checkVaul is used to check otherthan OpenCL API error code
        */
template<typename T>
static int checkVal(
    T input,
    T reference,
    std::string message, bool isAPIerror = true)
{
    if(input==reference)
    {
        return SDK_SUCCESS;
    }
    else
    {
        if(isAPIerror)
        {
            std::cout<<"Error: "<< message << " Error code : ";
            std::cout << getOpenCLErrorCodeStr(input) << std::endl;
        }
        else
        {
            error(message);
        }
        return SDK_FAILURE;
    }
}
/**
 * display devices
 * displays the devices in a platform
 * @param platform cl_platform_id
 * @param deviceType deviceType
 * @return 0 if success else nonzero
 */
static int displayDevices(cl_platform_id platform, cl_device_type deviceType)
{
    cl_int status;
    // Get platform name
    char platformVendor[1024];
    status = clGetPlatformInfo(platform, CL_PLATFORM_VENDOR, sizeof(platformVendor),
                               platformVendor, NULL);
    CHECK_OPENCL_ERROR(status, "clGetPlatformInfo failed");
    std::cout << "\nSelected Platform Vendor : " << platformVendor << std::endl;
    // Get number of devices available
    cl_uint deviceCount = 0;
    status = clGetDeviceIDs(platform, deviceType, 0, NULL, &deviceCount);
    CHECK_OPENCL_ERROR(status, "clGetDeviceIDs failed");
    cl_device_id* deviceIds = (cl_device_id*)malloc(sizeof(cl_device_id) *
                              deviceCount);
    CHECK_ALLOCATION(deviceIds, "Failed to allocate memory(deviceIds)");
    // Get device ids
    status = clGetDeviceIDs(platform, deviceType, deviceCount, deviceIds, NULL);
    CHECK_OPENCL_ERROR(status, "clGetDeviceIDs failed");
    // Print device index and device names
    for(cl_uint i = 0; i < deviceCount; ++i)
    {
        char deviceName[1024];
        status = clGetDeviceInfo(deviceIds[i], CL_DEVICE_NAME, sizeof(deviceName),
                                 deviceName, NULL);
        CHECK_OPENCL_ERROR(status, "clGetDeviceInfo failed");
        std::cout << "Device " << i << " : " << deviceName
                  <<" Device ID is "<<deviceIds[i]<< std::endl;
    }
    free(deviceIds);
    return SDK_SUCCESS;
}


/**
 * displayPlatformAnddevices
 * displays the devices in a platform
 * @param platform cl_platform_id
 * @param device array ofdeviceId
 * @param deviceCount number of devices
 * @return 0 if success else nonzero
 */
static int displayPlatformAndDevices(cl_platform_id platform,
                              const cl_device_id* device, const int deviceCount)
{
    cl_int status;
    // Get platform name
    char platformVendor[1024];
    status = clGetPlatformInfo(platform, CL_PLATFORM_VENDOR, sizeof(platformVendor),
                               platformVendor, NULL);
    CHECK_OPENCL_ERROR(status, "clGetPlatformInfo failed");
    std::cout << "\nSelected Platform Vendor : " << platformVendor << std::endl;
    // Print device index and device names
    for(cl_int i = 0; i < deviceCount; ++i)
    {
        char deviceName[1024];
        status = clGetDeviceInfo(device[i], CL_DEVICE_NAME, sizeof(deviceName),
                                 deviceName, NULL);
        CHECK_OPENCL_ERROR(status, "clGetDeviceInfo failed");
        std::cout << "Device " << i << " : " << deviceName << std::endl;
    }
    return SDK_SUCCESS;
}


/**
 * validateDeviceId
 * validates whether intended device is used
 * @param deviceId cl_device_id
 * @param deviceCount device number
 * @return 0 if success else nonzero
 */
static int validateDeviceId(int deviceId, int deviceCount)
{
    // Validate deviceIndex
    if(deviceId >= (int)deviceCount)
    {
        std::cout << "DeviceId should be < " << deviceCount << std::endl;
        return SDK_FAILURE;
    }
    return SDK_SUCCESS;
}


/**
 * generateBinaryImage
 * geenrate Binary for a kernel
 * @param binaryData bifdata object
 * @return 0 if success else nonzero
 */
static int generateBinaryImage(const bifData &binaryData)
{
    cl_int status = CL_SUCCESS;
    /*
     * Have a look at the available platforms and pick either
     * the AMD one if available or a reasonable default.
     */
    cl_uint numPlatforms;
    cl_platform_id platform = NULL;
    status = clGetPlatformIDs(0, NULL, &numPlatforms);
    CHECK_OPENCL_ERROR(status, "clGetPlatformIDs failed.");
    if (0 < numPlatforms)
    {
        cl_platform_id* platforms = new cl_platform_id[numPlatforms];
        status = clGetPlatformIDs(numPlatforms, platforms, NULL);
        CHECK_OPENCL_ERROR(status, "clGetPlatformIDs failed.");
        char platformName[100];
        for (unsigned i = 0; i < numPlatforms; ++i)
        {
            status = clGetPlatformInfo(
                         platforms[i],
                         CL_PLATFORM_VENDOR,
                         sizeof(platformName),
                         platformName,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetPlatformInfo failed.");
            platform = platforms[i];
            if (!strcmp(platformName, "Advanced Micro Devices, Inc."))
            {
                break;
            }
        }
        std::cout << "Platform found : " << platformName << "\n";
        delete[] platforms;
    }
    if(NULL == platform)
    {
        std::cout << "NULL platform found so Exiting Application.";
        return SDK_FAILURE;
    }
    /*
     * If we could find our platform, use it. Otherwise use just available platform.
     */
    cl_context_properties cps[5] =
    {
        CL_CONTEXT_PLATFORM,
        (cl_context_properties)platform,
        CL_CONTEXT_OFFLINE_DEVICES_AMD,
        (cl_context_properties)1,
        0
    };
    cl_context context = clCreateContextFromType(
                             cps,
                             CL_DEVICE_TYPE_ALL,
                             NULL,
                             NULL,
                             &status);
    CHECK_OPENCL_ERROR(status, "clCreateContextFromType failed.");
    /* create a CL program using the kernel source */
    SDKFile kernelFile;
    std::string kernelPath = getPath();
    kernelPath.append(binaryData.kernelName.c_str());
    if(!kernelFile.open(kernelPath.c_str()))
    {
        std::cout << "Failed to load kernel file : " << kernelPath << std::endl;
        return SDK_FAILURE;
    }
    const char * source = kernelFile.source().c_str();
    size_t sourceSize[] = {strlen(source)};
    cl_program program = clCreateProgramWithSource(
                             context,
                             1,
                             &source,
                             sourceSize,
                             &status);
    CHECK_OPENCL_ERROR(status, "clCreateProgramWithSource failed.");
    std::string flagsStr = std::string(binaryData.flagsStr.c_str());
    // Get additional options
    if(binaryData.flagsFileName.size() != 0)
    {
        SDKFile flagsFile;
        std::string flagsPath = getPath();
        flagsPath.append(binaryData.flagsFileName.c_str());
        if(!flagsFile.open(flagsPath.c_str()))
        {
            std::cout << "Failed to load flags file: " << flagsPath << std::endl;
            return SDK_FAILURE;
        }
        flagsFile.replaceNewlineWithSpaces();
        const char * flags = flagsFile.source().c_str();
        flagsStr.append(flags);
    }
    if(flagsStr.size() != 0)
    {
        std::cout << "Build Options are : " << flagsStr.c_str() << std::endl;
    }
    /* create a cl program executable for all the devices specified */
    status = clBuildProgram(
                 program,
                 0,
                 NULL,
                 flagsStr.c_str(),
                 NULL,
                 NULL);
    /* This function is intentionally left without a error check
      as it may not pass if kernels rely on specific properties of devices
      In such cases, binaries for eligible devices are geenrated and dumped
      even wen this function will return an error */
    //CHECK_OPENCL_ERROR(status, "clBuildProgram failed.");
    size_t numDevices;
    status = clGetProgramInfo(
                 program,
                 CL_PROGRAM_NUM_DEVICES,
                 sizeof(numDevices),
                 &numDevices,
                 NULL );
    CHECK_OPENCL_ERROR(status, "clGetProgramInfo(CL_PROGRAM_NUM_DEVICES) failed.");
    std::cout << "Number of devices found : " << numDevices << "\n\n";
    cl_device_id *devices = (cl_device_id *)malloc( sizeof(cl_device_id) *
                            numDevices );
    CHECK_ALLOCATION(devices, "Failed to allocate host memory.(devices)");
    /* grab the handles to all of the devices in the program. */
    status = clGetProgramInfo(
                 program,
                 CL_PROGRAM_DEVICES,
                 sizeof(cl_device_id) * numDevices,
                 devices,
                 NULL );
    CHECK_OPENCL_ERROR(status, "clGetProgramInfo(CL_PROGRAM_DEVICES) failed.");
    /* figure out the sizes of each of the binaries. */
    size_t *binarySizes = (size_t*)malloc( sizeof(size_t) * numDevices );
    CHECK_ALLOCATION(binarySizes, "Failed to allocate host memory.(binarySizes)");
    status = clGetProgramInfo(
                 program,
                 CL_PROGRAM_BINARY_SIZES,
                 sizeof(size_t) * numDevices,
                 binarySizes,
                 NULL);
    CHECK_OPENCL_ERROR(status, "clGetProgramInfo(CL_PROGRAM_BINARY_SIZES) failed.");
    size_t i = 0;
    /* copy over all of the generated binaries. */
    char **binaries = (char **)malloc( sizeof(char *) * numDevices );
    CHECK_ALLOCATION(binaries, "Failed to allocate host memory.(binaries)");
    for(i = 0; i < numDevices; i++)
    {
        if(binarySizes[i] != 0)
        {
            binaries[i] = (char *)malloc( sizeof(char) * binarySizes[i]);
            CHECK_ALLOCATION(binaries[i], "Failed to allocate host memory.(binaries[i])");
        }
        else
        {
            binaries[i] = NULL;
        }
    }
    status = clGetProgramInfo(
                 program,
                 CL_PROGRAM_BINARIES,
                 sizeof(char *) * numDevices,
                 binaries,
                 NULL);
    CHECK_OPENCL_ERROR(status, "clGetProgramInfo(CL_PROGRAM_BINARIES) failed.");
    /* dump out each binary into its own separate file. */
    for(i = 0; i < numDevices; i++)
    {
        char fileName[100];
        sprintf_s(fileName, "%s.%d", binaryData.binaryName.c_str(), (int)i);
        char deviceName[1024];
        status = clGetDeviceInfo(
                     devices[i],
                     CL_DEVICE_NAME,
                     sizeof(deviceName),
                     deviceName,
                     NULL);
        CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_NAME) failed.");
        if(binarySizes[i] != 0)
        {
            printf( "%s binary kernel: %s\n", deviceName, fileName);
            SDKFile BinaryFile;
            if(BinaryFile.writeBinaryToFile(fileName,
                                            binaries[i],
                                            binarySizes[i]))
            {
                std::cout << "Failed to load kernel file : " << fileName << std::endl;
                return SDK_FAILURE;
            }
        }
        else
        {
            printf(
                "%s binary kernel(%s) : %s\n",
                deviceName,
                fileName,
                "Skipping as there is no binary data to write!");
        }
    }
    // Release all resouces and memory
    for(i = 0; i < numDevices; i++)
    {
        if(binaries[i] != NULL)
        {
            free(binaries[i]);
            binaries[i] = NULL;
        }
    }
    if(binaries != NULL)
    {
        free(binaries);
        binaries = NULL;
    }
    if(binarySizes != NULL)
    {
        free(binarySizes);
        binarySizes = NULL;
    }
    if(devices != NULL)
    {
        free(devices);
        devices = NULL;
    }
    status = clReleaseProgram(program);
    CHECK_OPENCL_ERROR(status, "clReleaseProgram failed.");
    status = clReleaseContext(context);
    CHECK_OPENCL_ERROR(status, "clReleaseContext failed.");
    return SDK_SUCCESS;
}

/**
 * getPlatform
 * selects intended platform
 * @param platform cl_platform_id
 * @param platformId platform Number
 * @param platformIdEnabled if Platform option used
 * @return 0 if success else nonzero
 */
static int getPlatform(cl_platform_id &platform, int platformId,
                bool platformIdEnabled)
{
    cl_uint numPlatforms;
    cl_int status = clGetPlatformIDs(0, NULL, &numPlatforms);
    CHECK_OPENCL_ERROR(status, "clGetPlatformIDs failed. No OpenCL platform found. Check if the installation of the graphics driver has gone through successfully");
    if (0 < numPlatforms)
    {
        cl_platform_id* platforms = new cl_platform_id[numPlatforms];
        status = clGetPlatformIDs(numPlatforms, platforms, NULL);
        CHECK_OPENCL_ERROR(status, "clGetPlatformIDs failed.");
        if(platformIdEnabled)
        {
            platform = platforms[platformId];
        }
        else
        {
            char platformName[100];
            for (unsigned i = 0; i < numPlatforms; ++i)
            {
                status = clGetPlatformInfo(platforms[i],
                                           CL_PLATFORM_VENDOR,
                                           sizeof(platformName),
                                           platformName,
                                           NULL);
                CHECK_OPENCL_ERROR(status, "clGetPlatformInfo failed.");
                platform = platforms[i];
                if (!strcmp(platformName, "Advanced Micro Devices, Inc."))
                {
                    break;
                }
            }
            std::cout << "Platform found : " << platformName << "\n";
        }
        delete[] platforms;
    }
    if(NULL == platform)
    {
        error("NULL platform found so Exiting Application.");
        return SDK_FAILURE;
    }
    return SDK_SUCCESS;
}

/**
 * getDevices
 * selects intended device
 * @param context cl_context object
 * @param devices cl_device_id pointer to hold array of deviceIds
 * @param deviceId device Number
 * @param deviceIdEnabled if DeviceId option used
 * @return 0 if success else nonzero
 */
static int getDevices(cl_context &context, cl_device_id **devices, int deviceId,
               bool deviceIdEnabled)
{
    /* First, get the size of device list data */
    size_t deviceListSize = 0;
    int status = 0;
    status = clGetContextInfo(
                 context,
                 CL_CONTEXT_DEVICES,
                 0,
                 NULL,
                 &deviceListSize);
    CHECK_OPENCL_ERROR(status, "clGetContextInfo failed.");
    int deviceCount = (int)(deviceListSize / sizeof(cl_device_id));
    if(validateDeviceId(deviceId, deviceCount))
    {
        std::cout << "Invalid Device Selected";
        return SDK_FAILURE;
    }
    /**
     * Now allocate memory for device list based on the size we got earlier
     * Note that this memory is allocated to a pointer which is a argument
     * so it must not be deleted inside this function. The Sample implementer
     * has to delete the devices pointer in the host code at clean up
     */
    (*devices) = (cl_device_id *)malloc(deviceListSize);
    CHECK_ALLOCATION((*devices), "Failed to allocate memory (devices).");
    /* Now, get the device list data */
    status = clGetContextInfo(context,
                              CL_CONTEXT_DEVICES,
                              deviceListSize,
                              (*devices),
                              NULL);
    CHECK_OPENCL_ERROR(status, "clGetGetContextInfo failed.");
    UNUSED(deviceIdEnabled);
    return SDK_SUCCESS;
}

/**
 * buildOpenCLProgram
 * builds the opencl program
 * @param program program object
 * @param context cl_context object
 * @param buildData buildProgramData Object
 * @return 0 if success else nonzero
 */
static int buildOpenCLProgram(cl_program &program, const cl_context& context,
                       const buildProgramData &buildData)
{
    cl_int status = CL_SUCCESS;
    SDKFile kernelFile;
    std::string kernelPath = getPath();
    if(buildData.binaryName.size() != 0)
    {
        kernelPath.append(buildData.binaryName.c_str());
        if(kernelFile.readBinaryFromFile(kernelPath.c_str()))
        {
            std::cout << "Failed to load kernel file : " << kernelPath << std::endl;
            return SDK_FAILURE;
        }
        const char * binary = kernelFile.source().c_str();
        size_t binarySize = kernelFile.source().size();
        program = clCreateProgramWithBinary(context,
                                            1,
                                            &buildData.devices[buildData.deviceId],
                                            (const size_t *)&binarySize,
                                            (const unsigned char**)&binary,
                                            NULL,
                                            &status);
        CHECK_OPENCL_ERROR(status, "clCreateProgramWithBinary failed.");
    }
    else
    {
        kernelPath.append(buildData.kernelName.c_str());
        if(!kernelFile.open(kernelPath.c_str()))//bool
        {
            std::cout << "Failed to load kernel file: " << kernelPath << std::endl;
            return SDK_FAILURE;
        }
        const char * source = kernelFile.source().c_str();
        size_t sourceSize[] = {strlen(source)};
        program = clCreateProgramWithSource(context,
                                            1,
                                            &source,
                                            sourceSize,
                                            &status);
        CHECK_OPENCL_ERROR(status, "clCreateProgramWithSource failed.");
    }
    std::string flagsStr = std::string(buildData.flagsStr.c_str());
    // Get additional options
    if(buildData.flagsFileName.size() != 0)
    {
        SDKFile flagsFile;
        std::string flagsPath = getPath();
        flagsPath.append(buildData.flagsFileName.c_str());
        if(!flagsFile.open(flagsPath.c_str()))
        {
            std::cout << "Failed to load flags file: " << flagsPath << std::endl;
            return SDK_FAILURE;
        }
        flagsFile.replaceNewlineWithSpaces();
        const char * flags = flagsFile.source().c_str();
        flagsStr.append(flags);
    }
    if(flagsStr.size() != 0)
    {
        std::cout << "Build Options are : " << flagsStr.c_str() << std::endl;
    }
    /* create a cl program executable for all the devices specified */
    status = clBuildProgram(program, 1, &buildData.devices[buildData.deviceId],
                            flagsStr.c_str(), NULL, NULL);
    if(status != CL_SUCCESS)
    {
        if(status == CL_BUILD_PROGRAM_FAILURE)
        {
            cl_int logStatus;
            char *buildLog = NULL;
            size_t buildLogSize = 0;
            logStatus = clGetProgramBuildInfo (
                            program,
                            buildData.devices[buildData.deviceId],
                            CL_PROGRAM_BUILD_LOG,
                            buildLogSize,
                            buildLog,
                            &buildLogSize);
            CHECK_OPENCL_ERROR(logStatus, "clGetProgramBuildInfo failed.");
            buildLog = (char*)malloc(buildLogSize);
            CHECK_ALLOCATION(buildLog, "Failed to allocate host memory. (buildLog)");
            memset(buildLog, 0, buildLogSize);
            logStatus = clGetProgramBuildInfo (
                            program,
                            buildData.devices[buildData.deviceId],
                            CL_PROGRAM_BUILD_LOG,
                            buildLogSize,
                            buildLog,
                            NULL);
            if(checkVal(logStatus, CL_SUCCESS, "clGetProgramBuildInfo failed."))
            {
                free(buildLog);
                return SDK_FAILURE;
            }
            std::cout << " \n\t\t\tBUILD LOG\n";
            std::cout << " ************************************************\n";
            std::cout << buildLog << std::endl;
            std::cout << " ************************************************\n";
            free(buildLog);
        }
        CHECK_OPENCL_ERROR(status, "clBuildProgram failed.");
    }
    return SDK_SUCCESS;
}

static cl_int spinForEventsComplete(cl_uint num_events, cl_event *event_list)
{
	cl_int ret = 0;

	cl_int param_value;
	size_t param_value_size_ret;

	for (cl_uint e = 0; e < num_events; e++)
	{
		while (1)
		{
			ret |= clGetEventInfo(event_list[e],
				CL_EVENT_COMMAND_EXECUTION_STATUS,
				sizeof(cl_int),
				&param_value,
				&param_value_size_ret);

			if (param_value == CL_COMPLETE)
				break;
		}
	}

	for (cl_uint e = 0; e < num_events; e++)
		clReleaseEvent(event_list[e]);
	return ret;
}

/**
 * waitForEventAndRelease
 * waits for a event to complete and release the event afterwards
 * @param event cl_event object
 * @return 0 if success else nonzero
 */
static int waitForEventAndRelease(cl_event *event)
{
    cl_int status = CL_SUCCESS;

	status = clWaitForEvents(1, event);
	CHECK_OPENCL_ERROR(status, "clWaitForEvents Failed with Error Code:");
	
    status = clReleaseEvent(*event);
    CHECK_OPENCL_ERROR(status, "clReleaseEvent Failed with Error Code:");
	
    return SDK_SUCCESS;
}

/**
 * getLocalThreads
 * get Local Threads number
 */
static size_t getLocalThreads(size_t globalThreads, size_t maxWorkItemSize)
{
    if(maxWorkItemSize < globalThreads)
    {
        if(globalThreads%maxWorkItemSize == 0)
        {
            return maxWorkItemSize;
        }
        else
        {
            for(size_t i=maxWorkItemSize-1; i > 0; --i)
            {
                if(globalThreads%i == 0)
                {
                    return i;
                }
            }
        }
    }
    else
    {
        return globalThreads;
    }
    return SDK_SUCCESS;
}


/**
 * Returns correct version string(major.minor.build.revision)
 * version string contains major and minor values from SDK
 * build and revision values from OpenCL libraries
 * For example SDK version = AMD-APP-SDK-v2.5 (100.1)
 *             OpenCL version = OpenCL 1.1 AMD-APP-SDK (820.2)
 *             Final version = OpenCL 1.1 AMD-APP-SDK-v2.5 (820.2)
 * @return std::string
 */
inline std::string getExactVerStr(std::string clVerStr)
{
    std::string finalVerStr("");
    size_t vPos = clVerStr.find_first_of("v");
    /**
     * Use CL version string as it is if 'v' is found in
     * CL version string
     */
    if(vPos == std::string::npos)
    {
        // Get the required string from CL version
        size_t sPos = clVerStr.find_first_of(" ");
        sPos = clVerStr.find_first_of(" ", sPos + 1);
        finalVerStr = clVerStr.substr(0, sPos + 1);
        // Append required string from SDK version string
        std::string sdkStr = getSdkVerStr();
        size_t bPos = sdkStr.find_first_of("(");
        finalVerStr.append(sdkStr.substr(0, bPos + 1));
        // Append remaining string from CL version
        vPos = clVerStr.find_first_of("(");
        finalVerStr.append(clVerStr.substr(vPos + 1));
    }
    else
    {
        finalVerStr = clVerStr;
    }
    return finalVerStr;
}

/**
* CLCommandArgs class contains all the
* command arguments related info passed by the user inlcuding
* the decvice and platform infos.
*/
class CLCommandArgs : public SDKCmdArgsParser
{

    protected:
        
        //
        bool enableDeviceId;           /**< If deviceId used */
        bool enablePlatform;           /**< If platformId Used */
        bool gpu;                      /**< If GPU used */
        bool amdPlatform;              /**< If AMD Platform Used */
    public:
        bool multiDevice;              /**< Cmd Line Option- if MultiGPU */
        unsigned int deviceId;         /**< Cmd Line Option- device number */
        unsigned int platformId;       /**< Cmd Line Option- platform number */
        std::string deviceType;        /**< Cmd Line Option- set device type(cpu|gpu) */
        std::string dumpBinary;        /**< Cmd Line Option- Dump Binary with name */
        std::string loadBinary;        /**< Cmd Line Option- Load Binary with name */
        std::string flags;             /**< Cmd Line Option- compiler flags */

        /**
        */
        CLCommandArgs(bool enableMultiDevice = false)
            :SDKCmdArgsParser ()
        {
            deviceType = "gpu";
            multiDevice = enableMultiDevice;
            deviceId = 0;
            platformId = 0;
            enablePlatform = false;
            enableDeviceId = false;
            gpu = true;
            amdPlatform = false;
        }

        /**
        * isDumpBinaryEnabled
        * Checks if dump Binary Option is enabled
        * @return true if DumpBinary Enabled else false
        */
        bool isDumpBinaryEnabled()
        {
            if(dumpBinary.size() == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /**
         * isLoadBinaryEnabled
         * Checks if the sample wants to load a prebuilt binary
         * @return true if LoadBinary Enabled else false
         */
        bool isLoadBinaryEnabled()
        {
            if(loadBinary.size() == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /**
         * isCompilerFlagsSpecified
         * Checks if any compiler flag is specified for the kernel
         * @return true if CompierFlag Enabled else false
         */
        bool isComplierFlagsSpecified()
        {
            if(flags.size() == 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        /**
         * isPlatformEnabled
         * Checks if platform option is used
         * @return true if PlatformId Enabled else false
         */
        bool isPlatformEnabled()
        {
            return enablePlatform;
        }

        /**
         * isDeviceEnabled
         * Checks if device option is used
         * @return true if DeviceId Enabled else false
         */
        bool isDeviceIdEnabled()
        {
            return enableDeviceId;
        }

        /**
         * isThereGPU
         * Checks if a GPU is Present
         * @return true if GPU Present else false
         */
        bool isThereGPU()
        {
            return gpu;
        }

        /**
         * isAmdPlatform
         * Checks if AMD Platform is used
         * @return true if AMD Platform Enabled else false
         */
        bool isAmdPlatform()
        {
            return amdPlatform;
        }


        /**
        * parseCommandLine
        * parses the command line options given by user
        * @param argc Number of elements in cmd line input
        * @param argv array of char* storing the CmdLine Options
        * @return 0 on success Positive if expected and Non-zero on failure
        */
        int parseCommandLine(int argc, char **argv)
        {
            if(!parse(argv,argc))
            {
                usage();
                if((isArgSet("h",true) == true) || (isArgSet("help",false) == true))
                {
                    exit(SDK_SUCCESS);
                }
                return SDK_FAILURE;
            }
            if((isArgSet("h",true) == true) || (isArgSet("help",false) == true))
            {
                usage();
                exit(SDK_SUCCESS);
            }
            // Print the sdk version and exit the application
            if(isArgSet("v", true) || isArgSet("version", false))
            {
                std::cout << "SDK version : " << sampleVerStr.c_str() << std::endl;
                exit(0);
            }
            if(isArgSet("p",true) || isArgSet("platformId",false))
            {
                enablePlatform = true;
            }
            if(isArgSet("d",true) || isArgSet("deviceId",false))
            {
                enableDeviceId = true;
            }
            /* check about the validity of the device type */
            if(multiDevice)
            {
                if(!((deviceType.compare("cpu") == 0 )
                        || (deviceType.compare("gpu") ==0)
                        || (deviceType.compare("all") ==0)))
                {
                    std::cout << "Error. Invalid device options. "
                              << "only \"cpu\" or \"gpu\" or \"all\" supported\n";
                    usage();
                    return SDK_FAILURE;
                }
            }
            else
            {
                if(!((deviceType.compare("cpu") == 0 ) || (deviceType.compare("gpu") ==0)))
                {
                    std::cout << "Error. Invalid device options. "
                              << "only \"cpu\" or \"gpu\" or \"all\" supported\n";
                    usage();
                    return SDK_FAILURE;
                }
            }
            if(dumpBinary.size() != 0 && loadBinary.size() != 0)
            {
                std::cout << "Error. --dump and --load options are mutually exclusive\n";
                usage();
                return SDK_FAILURE;
            }
            if(loadBinary.size() != 0 && flags.size() != 0)
            {
                std::cout << "Error. --flags and --load options are mutually exclusive\n";
                usage();
                return SDK_FAILURE;
            }
            if(validatePlatformAndDeviceOptions() != SDK_SUCCESS)
            {
                std::cout << "validatePlatfromAndDeviceOptions failed.\n ";
                return SDK_FAILURE;
            }
            return SDK_SUCCESS;
        }

        /**
         * validatePlatformAndDeviceOptions
         * Validates if the intended platform and device is used
         * @return 0 on success Positive if expected and Non-zero on failure
         */
        int validatePlatformAndDeviceOptions()
        {
            cl_int status = CL_SUCCESS;
            cl_uint numPlatforms;
            cl_platform_id platform = NULL;
            status = clGetPlatformIDs(0, NULL, &numPlatforms);
            if(status != CL_SUCCESS)
            {
                std::cout<<"Error: clGetPlatformIDs failed. Error code : ";
                std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                return SDK_FAILURE;
            }
            if (0 < numPlatforms)
            {
                // Validate platformId
                if(platformId >= numPlatforms)
                {
                    if(numPlatforms - 1 == 0)
                    {
                        std::cout << "platformId should be 0" << std::endl;
                    }
                    else
                    {
                        std::cout << "platformId should be 0 to " << numPlatforms - 1 << std::endl;
                    }
                    usage();
                    return SDK_FAILURE;
                }
                // Get selected platform
                cl_platform_id* platforms = new cl_platform_id[numPlatforms];
                status = clGetPlatformIDs(numPlatforms, platforms, NULL);
                if(status != CL_SUCCESS)
                {
                    std::cout<<"Error: clGetPlatformIDs failed. Error code : ";
                    std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                    return SDK_FAILURE;
                }
                // Print all platforms
                for (unsigned i = 0; i < numPlatforms; ++i)
                {
                    char pbuf[100];
                    status = clGetPlatformInfo(platforms[i],
                                               CL_PLATFORM_VENDOR,
                                               sizeof(pbuf),
                                               pbuf,
                                               NULL);
                    if(status != CL_SUCCESS)
                    {
                        std::cout<<"Error: clGetPlatformInfo failed. Error code : ";
                        std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                        return SDK_FAILURE;
                    }
                    std::cout << "Platform " << i << " : " << pbuf << std::endl;
                }
                // Get AMD platform
                for (unsigned i = 0; i < numPlatforms; ++i)
                {
                    char pbuf[100];
                    status = clGetPlatformInfo(platforms[i],
                                               CL_PLATFORM_VENDOR,
                                               sizeof(pbuf),
                                               pbuf,
                                               NULL);
                    if(status != CL_SUCCESS)
                    {
                        std::cout<<"Error: clGetPlatformInfo failed. Error code : ";
                        std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                        return SDK_FAILURE;
                    }
                    platform = platforms[i];
                    if (!strcmp(pbuf, "Advanced Micro Devices, Inc."))
                    {
                        break;
                    }
                }
                if(isPlatformEnabled())
                {
                    platform = platforms[platformId];
                }
                // Check for AMD platform
                char pbuf[100];
                status = clGetPlatformInfo(platform,
                                           CL_PLATFORM_VENDOR,
                                           sizeof(pbuf),
                                           pbuf,
                                           NULL);
                if(status != CL_SUCCESS)
                {
                    std::cout<<"Error: clGetPlatformInfo failed. Error code : ";
                    std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                    return SDK_FAILURE;
                }
                if (!strcmp(pbuf, "Advanced Micro Devices, Inc."))
                {
                    amdPlatform = true;
                }
                cl_device_type dType = CL_DEVICE_TYPE_GPU;
                if(deviceType.compare("cpu") == 0)
                {
                    dType = CL_DEVICE_TYPE_CPU;
                }
                if(deviceType.compare("gpu") == 0)
                {
                    dType = CL_DEVICE_TYPE_GPU;
                }
                else
                {
                    dType = CL_DEVICE_TYPE_ALL;
                }
                // Check for GPU
                if(dType == CL_DEVICE_TYPE_GPU)
                {
                    cl_context_properties cps[3] =
                    {
                        CL_CONTEXT_PLATFORM,
                        (cl_context_properties)platform,
                        0
                    };
                    cl_context context = clCreateContextFromType(cps,
                                         dType,
                                         NULL,
                                         NULL,
                                         &status);
                    if(status == CL_DEVICE_NOT_FOUND)
                    {
                        dType = CL_DEVICE_TYPE_CPU;
                        gpu = false;
                    }
                    clReleaseContext(context);
                }
                // Get device count
                cl_uint deviceCount = 0;
                status = clGetDeviceIDs(platform, dType, 0, NULL, &deviceCount);
                if(status != CL_SUCCESS)
                {
                    std::cout<<"Error: clGetDeviceIDs failed. Error code : ";
                    std::cout << getOpenCLErrorCodeStr(status) << std::endl;
                    return SDK_FAILURE;
                }
                // Validate deviceId
                if(deviceId >= deviceCount)
                {
                    if(deviceCount - 1 == 0)
                    {
                        std::cout << "deviceId should be 0" << std::endl;
                    }
                    else
                    {
                        std::cout << "deviceId should be 0 to " << deviceCount - 1 << std::endl;
                    }
                    usage();
                    return SDK_FAILURE;
                }
                delete[] platforms;
            }
            return SDK_SUCCESS;
        }
        int initialize()
        {
            int defaultOptions = 10;
            if(multiDevice)
            {
                defaultOptions = 9;
            }
            Option *optionList = new Option[defaultOptions];
            CHECK_ALLOCATION(optionList, "Error. Failed to allocate memory (optionList)\n");
            optionList[0]._sVersion = "";
            optionList[0]._lVersion = "device";
            if(multiDevice)
            {
                optionList[0]._description = "Execute the openCL kernel on a device";
                optionList[0]._usage = "[cpu|gpu|all]";
            }
            else
            {
                optionList[0]._description = "Execute the openCL kernel on a device";
                optionList[0]._usage = "[cpu|gpu]";
            }
            optionList[0]._type = CA_ARG_STRING;
            optionList[0]._value = &deviceType;
            optionList[1]._sVersion = "q";
            optionList[1]._lVersion = "quiet";
            optionList[1]._description = "Quiet mode. Suppress all text output.";
            optionList[1]._usage = "";
            optionList[1]._type = CA_NO_ARGUMENT;
            optionList[1]._value = &quiet;
            optionList[2]._sVersion = "e";
            optionList[2]._lVersion = "verify";
            optionList[2]._description = "Verify results against reference implementation.";
            optionList[2]._usage = "";
            optionList[2]._type = CA_NO_ARGUMENT;
            optionList[2]._value = &verify;
            optionList[3]._sVersion = "t";
            optionList[3]._lVersion = "timing";
            optionList[3]._description = "Print timing.";
            optionList[3]._type = CA_NO_ARGUMENT;
            optionList[3]._value = &timing;
            optionList[4]._sVersion = "";
            optionList[4]._lVersion = "dump";
            optionList[4]._description = "Dump binary image for all devices";
            optionList[4]._usage = "[filename]";
            optionList[4]._type = CA_ARG_STRING;
            optionList[4]._value = &dumpBinary;
            optionList[5]._sVersion = "";
            optionList[5]._lVersion = "load";
            optionList[5]._description = "Load binary image and execute on device";
            optionList[5]._usage = "[filename]";
            optionList[5]._type = CA_ARG_STRING;
            optionList[5]._value = &loadBinary;
            optionList[6]._sVersion = "";
            optionList[6]._lVersion = "flags";
            optionList[6]._description =
                "Specify filename containing the compiler flags to build kernel";
            optionList[6]._usage = "[filename]";
            optionList[6]._type = CA_ARG_STRING;
            optionList[6]._value = &flags;
            optionList[7]._sVersion = "p";
            optionList[7]._lVersion = "platformId";
            optionList[7]._description =
                "Select platformId to be used[0 to N-1 where N is number platforms available].";
            optionList[7]._usage = "[value]";
            optionList[7]._type = CA_ARG_INT;
            optionList[7]._value = &platformId;
            optionList[8]._sVersion = "v";
            optionList[8]._lVersion = "version";
            optionList[8]._description = "AMD APP SDK version string.";
            optionList[8]._usage = "";
            optionList[8]._type = CA_NO_ARGUMENT;
            optionList[8]._value = &version;
            if(multiDevice == false)
            {
                optionList[9]._sVersion = "d";
                optionList[9]._lVersion = "deviceId";
                optionList[9]._description =
                    "Select deviceId to be used[0 to N-1 where N is number devices available].";
                optionList[9]._usage = "[value]";
                optionList[9]._type = CA_ARG_INT;
                optionList[9]._value = &deviceId;
            }
            _numArgs = defaultOptions;
            _options = optionList;
            return SDK_SUCCESS;
        }

};

/**
 * KernelWorkGroupInfo
 * class implements the functionality to query
 * various Kernel Work Group related parameters
 */

class KernelWorkGroupInfo
{
    public:
        cl_ulong localMemoryUsed;           /**< localMemoryUsed amount of local memory used by kernel */
        size_t kernelWorkGroupSize;         /**< kernelWorkGroupSize Supported WorkGroup size as per OpenCL Runtime*/
        size_t compileWorkGroupSize[3];     /**< compileWorkGroupSize WorkGroup size as mentioned in kernel source */

        /**
         * Constructor
         */
        KernelWorkGroupInfo():
            localMemoryUsed(0),
            kernelWorkGroupSize(0)
        {
            compileWorkGroupSize[0] = 0;
            compileWorkGroupSize[1] = 0;
            compileWorkGroupSize[2] = 0;
        }

        /**
         * setKernelWorkGroupInfo
         * Set all information for a given device id
         * @param kernel kernel object
         * @param deviceId deviceID of the kernel object
         * @return 0 if success else nonzero
         */
        int setKernelWorkGroupInfo(cl_kernel &kernel,cl_device_id &deviceId)
        {
            cl_int status = CL_SUCCESS;
            //Get Kernel Work Group Info
            status = clGetKernelWorkGroupInfo(kernel,
                                              deviceId,
                                              CL_KERNEL_WORK_GROUP_SIZE,
                                              sizeof(size_t),
                                              &kernelWorkGroupSize,
                                              NULL);
            if(checkVal(status, CL_SUCCESS,
                        "clGetKernelWorkGroupInfo failed(CL_KERNEL_WORK_GROUP_SIZE)"))
            {
                return SDK_FAILURE;
            }
            status = clGetKernelWorkGroupInfo(kernel,
                                              deviceId,
                                              CL_KERNEL_LOCAL_MEM_SIZE,
                                              sizeof(cl_ulong),
                                              &localMemoryUsed,
                                              NULL);
            if(checkVal(status, CL_SUCCESS,
                        "clGetKernelWorkGroupInfo failed(CL_KERNEL_LOCAL_MEM_SIZE)"))
            {
                return SDK_FAILURE;
            }
            status = clGetKernelWorkGroupInfo(kernel,
                                              deviceId,
                                              CL_KERNEL_COMPILE_WORK_GROUP_SIZE,
                                              sizeof(size_t) * 3,
                                              compileWorkGroupSize,
                                              NULL);
            if(checkVal(status, CL_SUCCESS,
                        "clGetKernelWorkGroupInfo failed(CL_KERNEL_COMPILE_WORK_GROUP_SIZE)"))
            {
                return SDK_FAILURE;
            }
            return SDK_SUCCESS;
        }
    private :

        /**
         * checkVal
         * Templated FunctionCheck whether any error occured
         * @param input templated input
         * @param reference templated input
         * @param message string message
         * @param isAPIerror bool optional variable
         * @return 0 if success, else nonzero
         */
        template<typename T>
        int checkVal(T input, T reference, std::string message,
                     bool isAPIerror = true) const
        {
            if(input==reference)
            {
                return 0;
            }
            else
            {
                if(isAPIerror)
                {
                    std::cout<<"Error: "<< message << " Error code : ";
                    std::cout << getOpenCLErrorCodeStr(input) << std::endl;
                }
                else
                {
                    std::cout << message;
                }
                return 1;
            }
        }

};

/**
 * SDKDeviceInfo
 * class implements the functionality to query
 * various Device related parameters
 */
class SDKDeviceInfo
{
    public :
        cl_device_type dType;               /**< dType device type*/
        cl_uint venderId;                   /**< vendorId VendorId of device*/
        cl_uint maxComputeUnits;            /**< maxComputeUnits maxComputeUnits of device*/
        cl_uint maxWorkItemDims;            /**< maxWorkItemDims maxWorkItemDimensions VendorId of device*/
        size_t* maxWorkItemSizes;           /**< maxWorkItemSizes maxWorkItemSizes of device*/
        size_t maxWorkGroupSize;            /**< maxWorkGroupSize max WorkGroup Size of device*/
        cl_uint preferredCharVecWidth;      /**< preferredCharVecWidth preferred Char VecWidth of device*/
        cl_uint preferredShortVecWidth;     /**< preferredShortVecWidth preferred Short VecWidth of device*/
        cl_uint preferredIntVecWidth;       /**< preferredIntVecWidth preferred Int VecWidth of device*/
        cl_uint preferredLongVecWidth;      /**< preferredLongVecWidth preferred Long VecWidth of device*/
        cl_uint preferredFloatVecWidth;     /**< preferredFloatVecWidth preferredFloatVecWidth of device*/
        cl_uint preferredDoubleVecWidth;    /**< preferredDoubleVecWidth preferred Double VecWidth of device*/
        cl_uint preferredHalfVecWidth;      /**< preferredHalfVecWidth preferred Half VecWidth of device*/
        cl_uint nativeCharVecWidth;         /**< nativeCharVecWidth native Char VecWidth of device*/
        cl_uint nativeShortVecWidth;        /**< nativeShortVecWidth nativeShortVecWidth of device*/
        cl_uint nativeIntVecWidth;          /**< nativeIntVecWidth nativeIntVecWidth of device*/
        cl_uint nativeLongVecWidth;         /**< nativeLongVecWidth nativeLongVecWidth of device*/
        cl_uint nativeFloatVecWidth;        /**< nativeFloatVecWidth native Float VecWidth of device*/
        cl_uint nativeDoubleVecWidth;       /**< nativeDoubleVecWidth native Double VecWidth of device*/
        cl_uint nativeHalfVecWidth;         /**< nativeHalfVecWidth native Half VecWidth of device*/
        cl_uint maxClockFrequency;          /**< maxClockFrequency max Clock Frequency of device*/
        cl_uint addressBits;                /**< addressBits address Bits of device*/
        cl_ulong maxMemAllocSize;           /**< maxMemAllocSize max Mem Alloc Size of device*/
        cl_bool imageSupport;               /**< imageSupport image Support of device*/
        cl_uint maxReadImageArgs;           /**< maxReadImageArgs max ReadImage Args of device*/
        cl_uint maxWriteImageArgs;          /**< maxWriteImageArgs max Write Image Args of device*/
        size_t image2dMaxWidth;             /**< image2dMaxWidth image 2dMax Width of device*/
        size_t image2dMaxHeight;            /**< image2dMaxHeight image 2dMax Height of device*/
        size_t image3dMaxWidth;             /**< image3dMaxWidth image3d MaxWidth of device*/
        size_t image3dMaxHeight;            /**< image3dMaxHeight image 3dMax Height of device*/
        size_t image3dMaxDepth;             /**< image3dMaxDepth image 3dMax Depth of device*/
        size_t maxSamplers;                 /**< maxSamplers maxSamplers of device*/
        size_t maxParameterSize;            /**< maxParameterSize maxParameterSize of device*/
        cl_uint memBaseAddressAlign;        /**< memBaseAddressAlign memBase AddressAlign of device*/
        cl_uint minDataTypeAlignSize;       /**< minDataTypeAlignSize minDataType AlignSize of device*/
        cl_device_fp_config
        singleFpConfig; /**< singleFpConfig singleFpConfig of device*/
        cl_device_fp_config
        doubleFpConfig; /**< doubleFpConfig doubleFpConfig of device*/
        cl_device_mem_cache_type
        globleMemCacheType; /**< globleMemCacheType globleMem CacheType of device*/
        cl_uint globalMemCachelineSize;     /**< globalMemCachelineSize globalMem Cacheline Size of device*/
        cl_ulong globalMemCacheSize;        /**< globalMemCacheSize globalMem CacheSize of device*/
        cl_ulong globalMemSize;             /**< globalMemSize globalMem Size of device*/
        cl_ulong maxConstBufSize;           /**< maxConstBufSize maxConst BufSize of device*/
        cl_uint maxConstArgs;               /**< maxConstArgs max ConstArgs of device*/
        cl_device_local_mem_type
        localMemType;/**< localMemType local MemType of device*/
        cl_ulong localMemSize;              /**< localMemSize localMem Size of device*/
        cl_bool errCorrectionSupport;       /**< errCorrectionSupport errCorrectionSupport of device*/
        cl_bool hostUnifiedMem;             /**< hostUnifiedMem hostUnifiedMem of device*/
        size_t timerResolution;             /**< timerResolution timerResolution of device*/
        cl_bool endianLittle;               /**< endianLittle endian Little of device*/
        cl_bool available;                  /**< available available of device*/
        cl_bool compilerAvailable;          /**< compilerAvailable compilerAvailable of device*/
        cl_device_exec_capabilities
        execCapabilities;/**< execCapabilities exec Capabilities of device*/
        cl_command_queue_properties
        queueProperties;/**< queueProperties queueProperties of device*/
        cl_platform_id platform;            /**< platform platform of device*/
        char* name;                         /**< name name of device*/
        char* vendorName;                   /**< venderName vender Name of device*/
        char* driverVersion;                /**< driverVersion driver Version of device*/
        char* profileType;                  /**< profileType profile Type of device*/
        char* deviceVersion;                /**< deviceVersion device Version of device*/
        char* openclCVersion;               /**< openclCVersion opencl C Version of device*/
        char* extensions;                   /**< extensions extensions of device*/

#ifdef CL_VERSION_2_0
		cl_device_svm_capabilities svmcaps;	/**< SVM Capabilities of device*/
		cl_uint maxQueueSize;				/**< MAXIMUM QUEUE SIZE*/	
#endif

        /**
         * Constructor
         */
        SDKDeviceInfo()
        {
            dType = CL_DEVICE_TYPE_GPU;
            venderId = 0;
            maxComputeUnits = 0;
            maxWorkItemDims = 0;
            maxWorkItemSizes = NULL;
            maxWorkGroupSize = 0;
            preferredCharVecWidth = 0;
            preferredShortVecWidth = 0;
            preferredIntVecWidth = 0;
            preferredLongVecWidth = 0;
            preferredFloatVecWidth = 0;
            preferredDoubleVecWidth = 0;
            preferredHalfVecWidth = 0;
            nativeCharVecWidth = 0;
            nativeShortVecWidth = 0;
            nativeIntVecWidth = 0;
            nativeLongVecWidth = 0;
            nativeFloatVecWidth = 0;
            nativeDoubleVecWidth = 0;
            nativeHalfVecWidth = 0;
            maxClockFrequency = 0;
            addressBits = 0;
            maxMemAllocSize = 0;
            imageSupport = CL_FALSE;
            maxReadImageArgs = 0;
            maxWriteImageArgs = 0;
            image2dMaxWidth = 0;
            image2dMaxHeight = 0;
            image3dMaxWidth = 0;
            image3dMaxHeight = 0;
            image3dMaxDepth = 0;
            maxSamplers = 0;
            maxParameterSize = 0;
            memBaseAddressAlign = 0;
            minDataTypeAlignSize = 0;
            singleFpConfig = CL_FP_ROUND_TO_NEAREST | CL_FP_INF_NAN;
            doubleFpConfig = CL_FP_FMA |
                             CL_FP_ROUND_TO_NEAREST |
                             CL_FP_ROUND_TO_ZERO |
                             CL_FP_ROUND_TO_INF |
                             CL_FP_INF_NAN |
                             CL_FP_DENORM;
            globleMemCacheType = CL_NONE;
            globalMemCachelineSize = CL_NONE;
            globalMemCacheSize = 0;
            globalMemSize = 0;
            maxConstBufSize = 0;
            maxConstArgs = 0;
            localMemType = CL_LOCAL;
            localMemSize = 0;
            errCorrectionSupport = CL_FALSE;
            hostUnifiedMem = CL_FALSE;
            timerResolution = 0;
            endianLittle = CL_FALSE;
            available = CL_FALSE;
            compilerAvailable = CL_FALSE;
            execCapabilities = CL_EXEC_KERNEL;
            queueProperties = 0;
            platform = 0;
            name = NULL;
            vendorName = NULL;
            driverVersion = NULL;
            profileType = NULL;
            deviceVersion = NULL;
            openclCVersion = NULL;
            extensions = NULL;
        };

        /**
         * Destructor
         */
        ~SDKDeviceInfo()
        {
            delete[] maxWorkItemSizes;
            delete[] name;
            delete[] vendorName;
            delete[] driverVersion;
            delete[] profileType;
            delete[] deviceVersion;
            delete[] openclCVersion;
            delete[] extensions;
        };

        /**
         * setKernelWorkGroupInfo
         * Set all information for a given device id
         * @param deviceId deviceID
         * @return 0 if success else nonzero
         */
        int setDeviceInfo(cl_device_id deviceId)
        {
            cl_int status = CL_SUCCESS;
            //Get device type
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_TYPE,
                         sizeof(cl_device_type),
                         &dType,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_TYPE) failed");
            //Get vender ID
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_VENDOR_ID,
                         sizeof(cl_uint),
                         &venderId,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_VENDOR_ID) failed");
            //Get max compute units
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_COMPUTE_UNITS,
                         sizeof(cl_uint),
                         &maxComputeUnits,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_COMPUTE_UNITS) failed");
            //Get max work item dimensions
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS,
                         sizeof(cl_uint),
                         &maxWorkItemDims,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS) failed");
            //Get max work item sizes
            if(maxWorkItemSizes != NULL) delete[] maxWorkItemSizes;
            maxWorkItemSizes = new size_t[maxWorkItemDims];
            CHECK_ALLOCATION(maxWorkItemSizes,
                             "Failed to allocate memory(maxWorkItemSizes)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_WORK_ITEM_SIZES,
                         maxWorkItemDims * sizeof(size_t),
                         maxWorkItemSizes,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS) failed");
            // Maximum work group size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_WORK_GROUP_SIZE,
                         sizeof(size_t),
                         &maxWorkGroupSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_WORK_GROUP_SIZE) failed");
            // Preferred vector sizes of all data types
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR,
                         sizeof(cl_uint),
                         &preferredCharVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT,
                         sizeof(cl_uint),
                         &preferredShortVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT,
                         sizeof(cl_uint),
                         &preferredIntVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG,
                         sizeof(cl_uint),
                         &preferredLongVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT,
                         sizeof(cl_uint),
                         &preferredFloatVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE,
                         sizeof(cl_uint),
                         &preferredDoubleVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PREFERRED_VECTOR_WIDTH_HALF,
                         sizeof(cl_uint),
                         &preferredHalfVecWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PREFERRED_VECTOR_WIDTH_HALF) failed");
            // Clock frequency
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_CLOCK_FREQUENCY,
                         sizeof(cl_uint),
                         &maxClockFrequency,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_CLOCK_FREQUENCY) failed");
            // Address bits
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_ADDRESS_BITS,
                         sizeof(cl_uint),
                         &addressBits,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_ADDRESS_BITS) failed");
            // Maximum memory alloc size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_MEM_ALLOC_SIZE,
                         sizeof(cl_ulong),
                         &maxMemAllocSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_MEM_ALLOC_SIZE) failed");
            // Image support
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE_SUPPORT,
                         sizeof(cl_bool),
                         &imageSupport,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_IMAGE_SUPPORT) failed");
            // Maximum read image arguments
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_READ_IMAGE_ARGS,
                         sizeof(cl_uint),
                         &maxReadImageArgs,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_READ_IMAGE_ARGS) failed");
            // Maximum write image arguments
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_WRITE_IMAGE_ARGS,
                         sizeof(cl_uint),
                         &maxWriteImageArgs,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_WRITE_IMAGE_ARGS) failed");
            // 2D image and 3D dimensions
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE2D_MAX_WIDTH,
                         sizeof(size_t),
                         &image2dMaxWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_IMAGE2D_MAX_WIDTH) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE2D_MAX_HEIGHT,
                         sizeof(size_t),
                         &image2dMaxHeight,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_IMAGE2D_MAX_HEIGHT) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE3D_MAX_WIDTH,
                         sizeof(size_t),
                         &image3dMaxWidth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_IMAGE3D_MAX_WIDTH) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE3D_MAX_HEIGHT,
                         sizeof(size_t),
                         &image3dMaxHeight,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_IMAGE3D_MAX_HEIGHT) failed");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_IMAGE3D_MAX_DEPTH,
                         sizeof(size_t),
                         &image3dMaxDepth,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_IMAGE3D_MAX_DEPTH) failed");
            // Maximum samplers
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_SAMPLERS,
                         sizeof(cl_uint),
                         &maxSamplers,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_MAX_SAMPLERS) failed");
            // Maximum parameter size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_PARAMETER_SIZE,
                         sizeof(size_t),
                         &maxParameterSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_PARAMETER_SIZE) failed");
            // Memory base address align
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MEM_BASE_ADDR_ALIGN,
                         sizeof(cl_uint),
                         &memBaseAddressAlign,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MEM_BASE_ADDR_ALIGN) failed");
            // Minimum data type align size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE,
                         sizeof(cl_uint),
                         &minDataTypeAlignSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE) failed");
            // Single precision floating point configuration
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_SINGLE_FP_CONFIG,
                         sizeof(cl_device_fp_config),
                         &singleFpConfig,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_SINGLE_FP_CONFIG) failed");
            // Double precision floating point configuration
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_DOUBLE_FP_CONFIG,
                         sizeof(cl_device_fp_config),
                         &doubleFpConfig,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_DOUBLE_FP_CONFIG) failed");
            // Global memory cache type
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_GLOBAL_MEM_CACHE_TYPE,
                         sizeof(cl_device_mem_cache_type),
                         &globleMemCacheType,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_GLOBAL_MEM_CACHE_TYPE) failed");
            // Global memory cache line size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE,
                         sizeof(cl_uint),
                         &globalMemCachelineSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE) failed");
            // Global memory cache size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_GLOBAL_MEM_CACHE_SIZE,
                         sizeof(cl_ulong),
                         &globalMemCacheSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_GLOBAL_MEM_CACHE_SIZE) failed");
            // Global memory size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_GLOBAL_MEM_SIZE,
                         sizeof(cl_ulong),
                         &globalMemSize,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_GLOBAL_MEM_SIZE) failed");
            // Maximum constant buffer size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE,
                         sizeof(cl_ulong),
                         &maxConstBufSize,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE) failed");
            // Maximum constant arguments
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_MAX_CONSTANT_ARGS,
                         sizeof(cl_uint),
                         &maxConstArgs,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_MAX_CONSTANT_ARGS) failed");
            // Local memory type
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_LOCAL_MEM_TYPE,
                         sizeof(cl_device_local_mem_type),
                         &localMemType,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_LOCAL_MEM_TYPE) failed");
            // Local memory size
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_LOCAL_MEM_SIZE,
                         sizeof(cl_ulong),
                         &localMemSize,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_LOCAL_MEM_SIZE) failed");
            // Error correction support
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_ERROR_CORRECTION_SUPPORT,
                         sizeof(cl_bool),
                         &errCorrectionSupport,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_ERROR_CORRECTION_SUPPORT) failed");
            // Profiling timer resolution
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PROFILING_TIMER_RESOLUTION,
                         sizeof(size_t),
                         &timerResolution,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_PROFILING_TIMER_RESOLUTION) failed");
            // Endian little
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_ENDIAN_LITTLE,
                         sizeof(cl_bool),
                         &endianLittle,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_ENDIAN_LITTLE) failed");
            // Device available
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_AVAILABLE,
                         sizeof(cl_bool),
                         &available,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_AVAILABLE) failed");
            // Device compiler available
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_COMPILER_AVAILABLE,
                         sizeof(cl_bool),
                         &compilerAvailable,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_COMPILER_AVAILABLE) failed");
            // Device execution capabilities
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_EXECUTION_CAPABILITIES,
                         sizeof(cl_device_exec_capabilities),
                         &execCapabilities,
                         NULL);
            CHECK_OPENCL_ERROR(status,
                               "clGetDeviceInfo(CL_DEVICE_EXECUTION_CAPABILITIES) failed");
            // Device queue properities
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_QUEUE_PROPERTIES,
                         sizeof(cl_command_queue_properties),
                         &queueProperties,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_QUEUE_PROPERTIES) failed");
            // Platform
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PLATFORM,
                         sizeof(cl_platform_id),
                         &platform,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_PLATFORM) failed");
            // Device name
            size_t tempSize = 0;
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_NAME,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_NAME) failed");
            if(name != NULL) delete[] name;
            name = new char[tempSize];
            CHECK_ALLOCATION(name, "Failed to allocate memory(name)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_NAME,
                         sizeof(char) * tempSize,
                         name,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_NAME) failed");
            // Vender name
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_VENDOR,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_VENDOR) failed");
            if(vendorName != NULL) delete[] vendorName;
            vendorName = new char[tempSize];
            CHECK_ALLOCATION(vendorName, "Failed to allocate memory(venderName)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_VENDOR,
                         sizeof(char) * tempSize,
                         vendorName,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_VENDOR) failed");
            // Driver name
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DRIVER_VERSION,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DRIVER_VERSION) failed");
            if(driverVersion != NULL) delete[] driverVersion;
            driverVersion = new char[tempSize];
            CHECK_ALLOCATION(driverVersion, "Failed to allocate memory(driverVersion)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DRIVER_VERSION,
                         sizeof(char) * tempSize,
                         driverVersion,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DRIVER_VERSION) failed");
            // Device profile
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PROFILE,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_PROFILE) failed");
            if(profileType != NULL) delete[] profileType;
            profileType = new char[tempSize];
            CHECK_ALLOCATION(profileType, "Failed to allocate memory(profileType)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_PROFILE,
                         sizeof(char) * tempSize,
                         profileType,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_PROFILE) failed");
            // Device version
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_VERSION,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_VERSION) failed");
            if(deviceVersion != NULL) delete[] deviceVersion;
            deviceVersion = new char[tempSize];
            CHECK_ALLOCATION(deviceVersion, "Failed to allocate memory(deviceVersion)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_VERSION,
                         sizeof(char) * tempSize,
                         deviceVersion,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_VERSION) failed");
            // Device extensions
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_EXTENSIONS,
                         0,
                         NULL,
                         &tempSize);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_EXTENSIONS) failed");
            if(extensions != NULL) delete[] extensions;
            extensions = new char[tempSize];
            CHECK_ALLOCATION(extensions, "Failed to allocate memory(extensions)");
            status = clGetDeviceInfo(
                         deviceId,
                         CL_DEVICE_EXTENSIONS,
                         sizeof(char) * tempSize,
                         extensions,
                         NULL);
            CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_EXTENSIONS) failed");
            // Device parameters of OpenCL 1.1 Specification
#ifdef CL_VERSION_1_1
            std::string deviceVerStr(deviceVersion);
            size_t vStart = deviceVerStr.find(" ", 0);
            size_t vEnd = deviceVerStr.find(" ", vStart + 1);
            std::string vStrVal = deviceVerStr.substr(vStart + 1, vEnd - vStart - 1);
            if(vStrVal.compare("1.0") > 0)
            {
                // Native vector sizes of all data types
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_CHAR,
                             sizeof(cl_uint),
                             &nativeCharVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_CHAR) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_SHORT,
                             sizeof(cl_uint),
                             &nativeShortVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_SHORT) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_INT,
                             sizeof(cl_uint),
                             &nativeIntVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_INT) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_LONG,
                             sizeof(cl_uint),
                             &nativeLongVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_LONG) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_FLOAT,
                             sizeof(cl_uint),
                             &nativeFloatVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_FLOAT) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE,
                             sizeof(cl_uint),
                             &nativeDoubleVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE) failed");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_NATIVE_VECTOR_WIDTH_HALF,
                             sizeof(cl_uint),
                             &nativeHalfVecWidth,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_NATIVE_VECTOR_WIDTH_HALF) failed");
                // Host unified memory
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_HOST_UNIFIED_MEMORY,
                             sizeof(cl_bool),
                             &hostUnifiedMem,
                             NULL);
                CHECK_OPENCL_ERROR(status,
                                   "clGetDeviceInfo(CL_DEVICE_HOST_UNIFIED_MEMORY) failed");
                // Device OpenCL C version
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_OPENCL_C_VERSION,
                             0,
                             NULL,
                             &tempSize);
                CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_OPENCL_C_VERSION) failed");
                if(openclCVersion != NULL) delete[] openclCVersion;
                openclCVersion = new char[tempSize];
                CHECK_ALLOCATION(openclCVersion, "Failed to allocate memory(openclCVersion)");
                status = clGetDeviceInfo(
                             deviceId,
                             CL_DEVICE_OPENCL_C_VERSION,
                             sizeof(char) * tempSize,
                             openclCVersion,
                             NULL);
                CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_OPENCL_C_VERSION) failed");
            }
#endif
#ifdef CL_VERSION_2_0
			if (checkOpenCL2_XCompatibility())
			{
				status = clGetDeviceInfo(
							 deviceId,
							 CL_DEVICE_SVM_CAPABILITIES,
							 sizeof(cl_device_svm_capabilities),
							 &svmcaps,
							 NULL);
				CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_SVM_CAPABILITIES) failed");

				status = clGetDeviceInfo(
							 deviceId,
							 CL_DEVICE_QUEUE_ON_DEVICE_MAX_SIZE,
							 sizeof(cl_uint),
							 &maxQueueSize,
							 NULL);
				CHECK_OPENCL_ERROR(status, "clGetDeviceInfo(CL_DEVICE_QUEUE_ON_DEVICE_MAX_SIZE) failed");
			}
#endif
            return SDK_SUCCESS;
        }

/**
 * detectSVM
 * Check if the device supports Shared virtual memory(SVM)
 * @return bool 
 */
bool detectSVM()
{
	bool svmSupport = false;

#ifdef CL_VERSION_2_0
	if (this->svmcaps & (CL_DEVICE_SVM_COARSE_GRAIN_BUFFER | CL_DEVICE_SVM_FINE_GRAIN_BUFFER | CL_DEVICE_SVM_FINE_GRAIN_SYSTEM | CL_DEVICE_SVM_ATOMICS))
	{
		svmSupport = true;
	}
#endif

	return svmSupport;
}

/**
 * detectOpenCL2_xCompatibility
 * Check if the device supports OpenCL 2.x 
 * @return @bool
 */
bool checkOpenCL2_XCompatibility()
{
	bool isOpenCL2_XSupported = false;

	int majorRev, minorRev;
    if (sscanf_s(this->deviceVersion, "OpenCL %d.%d", &majorRev, &minorRev) == 2) 
    {
      if (majorRev >= 2) {
	    isOpenCL2_XSupported = true;
      }
    }

	return isOpenCL2_XSupported;
}

    private :

        /**
         * checkVal
         * Templated FunctionCheck whether any error occured
         */
        template<typename T>
        int checkVal(T input, T reference, std::string message,
                     bool isAPIerror = true) const
        {
            if(input==reference)
            {
                return 0;
            }
            else
            {
                if(isAPIerror)
                {
                    std::cout<<"Error: "<< message << " Error code : ";
                    std::cout << getOpenCLErrorCodeStr(input) << std::endl;
                }
                else
                {
                    std::cout << message;
                }
                return 1;
            }
        }

};



}
#endif
