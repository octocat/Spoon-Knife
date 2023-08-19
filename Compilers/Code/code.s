	.file	"code.c"   # file name
	.text   
	.globl	_calculateFrequency #_calculateFrequency is a global name
	.def	_calculateFrequency;	.scl	2;	.type	32;	.endef 
_calculateFrequency:  #calculatefrequency function starts
LFB10:     
	.cfi_startproc  # call Frame information
	pushl	%ebp  # pushes the current base pointer onto the stack
	.cfi_def_cfa_offset 8 
	.cfi_offset 5, -8 
	movl	%esp, %ebp   # setting the current base pointer to stack pointer
	.cfi_def_cfa_register 5
	subl	$16, %esp # sub esp and make it esp-16
	movl	$0, -4(%ebp) # initializing ebp-4 value as 0 i.e initializing i as 0 
	jmp	L2 # go to label L2
L7:
	movl	$1, -12(%ebp)  # initializing ctr with 1
	movl	-4(%ebp), %eax # moving i value  to eax
	addl	$1, %eax # adding 1 to i and storing in eax i.e j=i+1
	movl	%eax, -8(%ebp) # setting ebp-8 as j 
	jmp	L3 # jumping to label L3
L5:
	movl	-4(%ebp), %eax # moving i to eax
	leal	0(,%eax,4), %edx # calculating the address offset of arr1[i] from arr1[]
	movl	8(%ebp), %eax # moving address of arr1[] into eax
	addl	%edx, %eax # calculating address of arr1[i]
	movl	(%eax), %edx # moving value of arr[i] to edx 
	movl	-8(%ebp), %eax # moving j value to eax
	leal	0(,%eax,4), %ecx # calculating the address offset of arr1[j] from arr1[] to ecx
	movl	8(%ebp), %eax # moving address of arr1[] to eax
	addl	%ecx, %eax # calculating address of arr1[j]
	movl	(%eax), %eax # moving value of arr1[j] to eax
	cmpl	%eax, %edx # comparing arr1[i] and arr1[j]
	jne	L4
	addl	$1, -12(%ebp) # adding 1 to ctr i.e ctr++
	movl	-8(%ebp), %eax # moving j to eax
	leal	0(,%eax,4), %edx # calculating offset of fr1[j] from fr1[] 
	movl	16(%ebp), %eax # moving address of fr1[] to eax
	addl	%edx, %eax # calculating address of fr1[j]
	movl	$0, (%eax) # setting fr1[j]=0
L4:
	addl	$1, -8(%ebp) # adding 1 to j i.e j=j+1
L3:
	movl	-8(%ebp), %eax # moving value of j to eax
	cmpl	12(%ebp), %eax # comparing n with j
	jl	L5 # if j > n then go to L5
	movl	-4(%ebp), %eax # moving i to eax
	leal	0(,%eax,4), %edx # calculating offset of fr1[i] from fr1[]
	movl	16(%ebp), %eax # moving address of fr1[] to eax
	addl	%edx, %eax # calculating address of fr1[i]
	movl	(%eax), %eax # moving value of fr1[i] to eax
	testl	%eax, %eax # if fr1[i]!=0 set 
	je	L6 # if fr1[i] equal to 0 jump to L6 label
	movl	-4(%ebp), %eax # moving value of i to eax
	leal	0(,%eax,4), %edx # calculating offset of fr1[i] from fr1[]
	movl	16(%ebp), %eax # moving address of fr1[]
	addl	%eax, %edx # calculating address of fr1[i]
	movl	-12(%ebp), %eax # moving value of ctr to eax
	movl	%eax, (%edx) # fr1[i]=ctr
L6:
	addl	$1, -4(%ebp)	# adding 1 to i i.e i=i+1
L2:
	movl	-4(%ebp), %eax # moving address of i to eax 
	cmpl	12(%ebp), %eax # comparing value of n and i
	jl	L7  # if i>n then jump to L7
	nop # after completion do nothing 
	leave 
	.cfi_restore 5
	.cfi_def_cfa 4, 4
	ret
	.cfi_endproc
LFE10:
	.section .rdata,"dr"
LC0:
	.ascii "Element\11Frequency\0"
LC1:
	.ascii "%d\11%d\12\0"
	.text
	.globl	_printArrayWithFrequency
	.def	_printArrayWithFrequency;	.scl	2;	.type	32;	.endef
_printArrayWithFrequency:
LFB11:
	.cfi_startproc
	pushl	%ebp # pushes the current base pointer onto the stack
	.cfi_def_cfa_offset 8
	.cfi_offset 5, -8
	movl	%esp, %ebp # setting the current base pointer to stack pointer
	.cfi_def_cfa_register 5
	subl	$40, %esp # subtracting 
	movl	$LC0, (%esp) 
	call	_puts
	movl	$0, -12(%ebp) # setting i=0
	jmp	L9
L11:
	movl	-12(%ebp), %eax # moving i value to eax
	leal	0(,%eax,4), %edx # calculating offset of address of fr1[i] from fr1[]
	movl	12(%ebp), %eax # moving address of fr1[] to eax
	addl	%edx, %eax # calculating address of fr1[i]
	movl	(%eax), %eax # moving value fo fr1[i] to eax
	testl	%eax, %eax 
	je	L10 # if fr1[i] equal to 0 then jump to L10
	movl	-12(%ebp), %eax # moving i to eax
	leal	0(,%eax,4), %edx # calculating offset of address of fr1[i] from fr1[]
	movl	12(%ebp), %eax # moving address of fr1[] to eax
	addl	%edx, %eax # calculating address of fr1[i]
	movl	(%eax), %edx # moving value of fr1[i] to edx
	movl	-12(%ebp), %eax # moving value of i to eax
	leal	0(,%eax,4), %ecx # calculating offset of arr1[i] from arr1[]
	movl	8(%ebp), %eax # moving address of arr1[i] to eax
	addl	%ecx, %eax # calculating address of arr1[i]
	movl	(%eax), %eax # moving value of arr1[i] to eax
	movl	%edx, 8(%esp) # moving value of fr1[i] to esp+8
	movl	%eax, 4(%esp) # moving value of arr1[i] to esp+4
 	movl	$LC1, (%esp) # moving address of LC1 to esp
	call	_printf # calling printf function to print LC1
L10:
	addl	$1, -12(%ebp) # increase i by 1 i.e i=i+1
L9:
	movl	-12(%ebp), %eax # moving value of i to eax
	cmpl	16(%ebp), %eax # comparing n and i
	jl	L11 # if i < n then jump to label L11
	nop # do nothing after completion
	leave 
	.cfi_restore 5
	.cfi_def_cfa 4, 4
	ret
	.cfi_endproc
LFE11:
	.def	___main;	.scl	2;	.type	32;	.endef
	.section .rdata,"dr"
	.align 4
LC2:
	.ascii "\12\12Count frequency of each integer element of an array:\0"
	.align 4
LC3:
	.ascii "------------------------------------------------\0"
	.align 4
LC4:
	.ascii "Input the number of elements to be stored in the array :\0"
LC5:
	.ascii "%d\0"
	.align 4
LC6:
	.ascii "Enter each elements separated by space: \0"
	.text
	.globl	_main
	.def	_main;	.scl	2;	.type	32;	.endef
_main:
LFB12:
	.cfi_startproc   # function starting 
	pushl	%ebp # preparing to create a new stack frame
	.cfi_def_cfa_offset 8
	.cfi_offset 5, -8 
	movl	%esp, %ebp  # making base pointer works as stack pointer
	.cfi_def_cfa_register 5 
	andl	$-16, %esp # Align the stack by using AND and -16	
	subl	$832, %esp # Allocate space on stack for local variables
	call	___main # initialization function for main
	movl	$LC2, (%esp) # moving address of LC2 to esp
	call	_puts # calls puts function to print LC2
	movl	$LC3, (%esp) # moving address of LC3 to esp
	call	_puts # calls puts function to print LC3
	movl	$LC4, (%esp) # moving address of LC4 to esp
	call	_printf # printing the statements before input
	leal	20(%esp), %eax # calculating effective address and storing it in eax
	movl	%eax, 4(%esp) # calculating address as the second argument for scanf
	movl	$LC5, (%esp)  # storing address of LC5 in esp
	call	_scanf 
	movl	$LC6, (%esp) # storing address of LC6 in esp
	call	_printf # printing LC6 statement
	movl	$0, 828(%esp) # initialize i=0
	jmp	L13
L14:
	leal	424(%esp), %eax # calculate effective address and store it in eax
	movl	828(%esp), %edx # moving value of i to edx
	sall	$2, %edx # multiplies edx by 4(2^2) and stores it in it again
	addl	%edx, %eax # add edx to eax and store it in eax
	movl	%eax, 4(%esp) # store eax as second argument for scanf 
	movl	$LC5, (%esp) # store address of LC5 in esp
	call	_scanf # input for array elements
	addl	$1, 828(%esp) # increase i by 1 i.e i=i+1
L13:
	movl	20(%esp), %eax # moving value of n into eax
	cmpl	%eax, 828(%esp) # comparing n and i
	jl	L14 # jump to L14 if n < i
	movl	$0, 824(%esp) # initializing i=0
	jmp	L15 # go to L15
L16:
	movl	824(%esp), %eax # moving value of i to eax
	movl	$-1, 24(%esp,%eax,4) # making fr1[i] = -1
	addl	$1, 824(%esp) # adding 1 to i i.e i=i+1
L15:
	movl	20(%esp), %eax # moving value of n to eax
	cmpl	%eax, 824(%esp) # comparing n and i
	jl	L16 # if n < i go to label L16
	movl	20(%esp), %eax # moving value of n to eax
	leal	24(%esp), %edx # calculate effective address and store in edx
	movl	%edx, 8(%esp) # calculate effective address for second argument of calculateFrequency
	movl	%eax, 4(%esp) # calculate effective address for third argument of calculateFrequency
	leal	424(%esp), %eax # calculate effective address and store it in eax
	movl	%eax, (%esp) # address for the first argument of calculateFrequency
	call	_calculateFrequency    # call calculateFrequency function 
	movl	20(%esp), %eax # moving value of n to eax
	movl	%eax, 8(%esp) # calculate address for the second argument of printArraywithFrequency
	leal	24(%esp), %eax # calculate effective address and store it in eax
	movl	%eax, 4(%esp) # calculate effective address for third argument of printArraywithFrequency
	leal	424(%esp), %eax # calculate effective address and store it in eax
	movl	%eax, (%esp) # calculate address for the first argument of printArrayWithFrequency
	call	_printArrayWithFrequency  # call printArrayWithFrequency function
	movl	$0, %eax # return 0
	leave  # clean up and undwind the stack
	.cfi_restore 5
	.cfi_def_cfa 4, 4
	ret
	.cfi_endproc
LFE12:
	.ident	"GCC: (MinGW.org GCC-6.3.0-1) 6.3.0"
	.def	_puts;	.scl	2;	.type	32;	.endef
	.def	_printf;	.scl	2;	.type	32;	.endef
	.def	_scanf;	.scl	2;	.type	32;	.endef
