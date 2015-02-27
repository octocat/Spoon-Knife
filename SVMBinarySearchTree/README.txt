SVMBinarySearchTree

This sample demonstrates the use of the coarse-grain Shared Virtual Memory (SVM) feature of OpenCL.2.0 using the Binary Tree search algorithm.

Prerequisite:

	Graphics Driver : 
		- Install AMD OpenCL 2.0 Driver located here http://support.amd.com/en-us/kb-articles/Pages/OpenCL2-Driver.aspx

	Compatible Operating Systems:
		- Microsoft Windows:
			Windows 8.1 (64-bit version)
		- Linux Distributions:
			Red Hat Enterprise 6.5 (64-bit version)
			Ubuntu 14.04 (64-bit version)

	Compatible Hardware: 
		- Check the AMD Product compatibility from the driver download page here http://support.amd.com/en-us/kb-articles/Pages/OpenCL2-Driver.aspx
		
	Software
		- Windows : Visual Studio 2013
		- Linux : CMake 2.8.0 or higher

How to Compile

	Windows:
		- The zip file contains Visual Studio 2013 project file of the sample [location: <base_folder>\samples\opencl\cl\<sample_name>]. Open the project file and compile it in 64-bit configuration
		- The zip file also contains CMakeLists.txt. This can be used to generate project files of any other versions of Visual Studio available on your machine
	Linux:
		- The zip file contains CMakeLists.txt [location: <base_folder>/samples/opencl/cl/<sample_name>]. Use this to generate make files.
			$> cmake .
		- Compile the sample using the make file
			$> make

Run the sample

	Execute the sample typing the following command 
		Windows : $> SVMBinaryTreeSearch.exe 	[location: <sample_name>\bin\x86_64\<build> ]
		Linux :	  $> ./SVMBinaryTreeSearch	[location: <sample_name>/bin/x86_64/<build> ]
		
	Command Line Options:
	-h	--help 			Shows all command options and their respective meanings.
		--device 		Devices on which the program is to be run. Acceptable values are cpu or gpu.
	-q 	--quiet 		Quiet mode. Suppresses most text output.
	-e 	--verify 		Verify results against reference implementation.
	-t 	--timing 		Print timing related statistics.
		--dump 			Dump binary image for all devices.
		--load 			Load binary image and execute on device.
		--flags 		Specify compiler flags to build the kernel.
	-p	--platformId	Select platformId to be used (0 to N-1, where N is the number of available platforms).
	-d 	--deviceId 		Select deviceId to be used (0 to N-1, where N is the number of available devices).
	-v 	--version 		AMD APP SDK version string.
	-i	--iterations	Number of iterations for kernel execution.
	-n	--nodes			Number of nodes in binary tree.
	-k	--keys			Number of keys to be searched.
	-r	--randMax		Maximum random number value(0 to randMax).
	-s	--seed			Seed to random number generator(0 indicates internal seed).
