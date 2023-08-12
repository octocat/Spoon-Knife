.data
prompt:
.asciiz "Enter a positive integer"

number:
.space 11

result1:
.asciiz "The sum of"

result2:
.asciiz "is"

newline:
.asciiz "\n"

.text
.globl main
main:

la $a0,prompt
li $v0,4
syscall  #printing prompt

li v0,5
syscall
move $s0,$v0

li $s1,0 #sum=0
li $s2,0 #i=0

for:
blt $s0,$s2,endf
add $s1,$s1,$s2
add $s2,$s2,1
b for

endf:

la $a0,result1
li $v0,4
syscall

la $a0,$s0
li $v0,4
syscall

la $a0,result2
li $v0,4
syscall

la $a0,$s1
li $v0,4
syscall

la $a0,newline 
li $v0,4
syscall

la $a0,newline 
li $v0,4
syscall

li $v0,10 #terminate the program

