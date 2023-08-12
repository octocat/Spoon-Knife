.data 
prompt:
.asciiz "Enter your name"

.text
.globl main
main:
la $a0,prompt
li $v0,4
