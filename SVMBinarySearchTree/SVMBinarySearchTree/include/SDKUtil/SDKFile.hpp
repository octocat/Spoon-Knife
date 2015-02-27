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
#ifndef SDKFILE_HPP_
#define SDKFILE_HPP_

/**
 * Header Files
 */
#include <vector>
#include <string>
#include <fstream>
#include <malloc.h>


#if defined(_WIN32) || defined(__CYGWIN__)
#include <direct.h>
#define GETCWD _getcwd
#else // !_WIN32
#include <cstring>
#include <cstdlib>
#include <unistd.h>
#define GETCWD ::getcwd
#endif // !_WIN32

#ifndef _WIN32
#define fopen_s(file, fileName, mode) ((*(file)) = fopen((fileName), (mode)))==NULL
#endif

/**
 * namespace appsdk
 */
namespace appsdk
{
/**
 * getCurrentDir
 * Get current directory
 * @return string
 */
static std::string getCurrentDir()
{
    const   size_t  pathSize = 4096;
    char    currentDir[pathSize];
    // Check if we received the path
    if (GETCWD(currentDir, pathSize) != NULL)
    {
        return std::string(currentDir);
    }
    return  std::string("");
}

/**
 * class SDKFile
 * for the opencl program file processing
 */
class SDKFile
{
    public:
        /**
         *Default constructor
         */
        SDKFile(): source_("") {}

        /**
         * Destructor
         */
        ~SDKFile() {};

        /**
         * Opens the CL program file
         * @return true if success else false
         */
        bool open(const char* fileName)
        {
            size_t      size;
            char*       str;
            // Open file stream
            std::fstream f(fileName, (std::fstream::in | std::fstream::binary));
            // Check if we have opened file stream
            if (f.is_open())
            {
                size_t  sizeFile;
                // Find the stream size
                f.seekg(0, std::fstream::end);
                size = sizeFile = (size_t)f.tellg();
                f.seekg(0, std::fstream::beg);
                str = new char[size + 1];
                if (!str)
                {
                    f.close();
                    return  false;
                }
                // Read file
                f.read(str, sizeFile);
                f.close();
                str[size] = '\0';
                source_  = str;
                delete[] str;
                return true;
            }
            return false;
        }

        /**
         * writeBinaryToFile
         * @param fileName Name of the file
         * @param binary char binary array
         * @param numBytes number of bytes
         * @return true if success else false
         */
        int writeBinaryToFile(const char* fileName, const char* binary, size_t numBytes)
        {
            FILE *output = NULL;
            
	    if(fopen_s(&output, fileName, "wb"))
            {
                return SDK_FAILURE;
            }
            fwrite(binary, sizeof(char), numBytes, output);
            fclose(output);
            return SDK_SUCCESS;
        }


        /**
         * readBinaryToFile
         * @param fileName name of file
         * @return true if success else false
         */
        int readBinaryFromFile(const char* fileName)
        {
            FILE * input = NULL;
            size_t size = 0,val;
            char* binary = NULL;
            
            if(fopen_s(&input, fileName, "rb"))
            {
                return SDK_FAILURE;
            }
            fseek(input, 0L, SEEK_END);
            size = ftell(input);
            rewind(input);
            binary = (char*)malloc(size);
            if(binary == NULL)
            {
                return SDK_FAILURE;
            }
            val=fread(binary, sizeof(char), size, input);
            fclose(input);
            source_.assign(binary, size);
            free(binary);
            return SDK_SUCCESS;
        }


        /**
         * Replaces Newline with spaces
         */
        void replaceNewlineWithSpaces()
        {
            size_t pos = source_.find_first_of('\n', 0);
            while(pos != -1)
            {
                source_.replace(pos, 1, " ");
                pos = source_.find_first_of('\n', pos + 1);
            }
            pos = source_.find_first_of('\r', 0);
            while(pos != -1)
            {
                source_.replace(pos, 1, " ");
                pos = source_.find_first_of('\r', pos + 1);
            }
        }

        /**
         * source
         * Returns a pointer to the string object with the source code
         */
        const std::string&  source() const
        {
            return source_;
        }

    private:
        /**
         * Disable copy constructor
         */
        SDKFile(const SDKFile&);

        /**
         * Disable operator=
         */
        SDKFile& operator=(const SDKFile&);

        std::string     source_;    //!< source code of the CL program
};

} // namespace appsdk

#endif  // SDKFile_HPP_
