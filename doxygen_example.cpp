/** @file doxygen_example.cpp
@author Lastname:Firstname:A00123456:cscxxxxx
@version Revision 1.1
@brief Illustrates doxygen-style comments for documenting a C++
program file and the functions in that file.
@details If you want to add any further detailed description of
what is in the file, then place it here (after the first statement)
and it will appear in the detailed description section of the HTML
output description for the file.
@date Monday, September 19, 2011
*/

/**
@mainpage
This short program contains some sample code illustrating
how the doxygen comments must appear
- for documenting a file, and in particular
- for documenting functions
.
when we intend to use the doxygen tool for preparing HTML
documentation of our code. Note that this file is intended
<em>only</em> to illustrate a particular set of <b>commenting
conventions</b> and how they show up when implemented with
doxygen. Your actual requirements may not be the same as
shown here. Im particular you may need less (or more) than
is shown here.

Pay careful attention, in the source code,\n to the distinction
between the special doxygen comments,<br>which produce output
here, and regular C++ comments which are ignored by doxygen,
and look at the source code to see how line breaks in this
paragraph are produced.
*/

/*
Author self-assessment statement:
This program is complete and working according to spcecifications,
according to the best of my knowledge.
Or ...
This program is incomplete in the following ways
1. ...
2. ...
And/or ...
This program still contains the following bugs:
1. ...
2. ...
And by the way, note that this is a C++ but non-doxygen comment,
so it will not appear in the HTML displays produced by doxygen.
*/


//Include section
#include <iostream>
#include <string>
using namespace std;


//Prototype section
void DoSomething
(
    int numberOfPositions,   //in
    char& firstInitial,      //inout
    string& stringOfInitials //out
);
/**<
A single statement goes here to give a high-level description of
the function, which is ended by the first period. Any further
description of the function, such as this statement that comes
after the first statement, will appear as part of the "detailed
description" for this function. The brief description may also
be repeated here immediately prior to the detailed description,
but the configuration file for this example is currently set to
disable that feature.
@return void
@param numberOfPositions The number of positions firstInitial is to
be  moved forward.
@param firstInitial A character representing the first letter in a
person's first name (for example).
@param stringOfInitials A string in which all characters are the
same.
@pre
-# numberOfPositions contains a positive integer.
-# firstInitial contains a printable character at least numberOfPositions
positions from the end of the printable character set.
@post
-# firstInitial contains the character numberOfPositions to the right of
its original value.
-# stringOfInitials contains a string of length numberOfPositions
in which each character is the original value of firstInitial.
*/


int numberOfDigits
(
    int n //in
);
/**<
Compute and return the number of digits in a positive integer.
The style used for the pre/post coditions of this function is
purposely different from that for the void function given above,
just so you can see the differnce in the HTML output.
@return The number of digits in n.
@param n An integer, the number of whose digits is desired.
@pre n contains a positive integer.
This is some other precondition, and note that it does not
start on a new line.
@post
The number of digits in n has been returned.
\n This is some other post condition, and note that it does start
on a new line.
*/


int main()
{
    int count = 6;
    char myInitial = 'P';
    string allOneLetter;

    DoSomething(count, myInitial, allOneLetter);
    cout << endl;
    cout << count << " " << myInitial << " " << allOneLetter << endl;

    cout << "\nNumber of digits in 0 ...... " << numberOfDigits(0);
    cout << "\nNumber of digits in 7 ...... " << numberOfDigits(7);
    cout << "\nNumber of digits in 123 .... " << numberOfDigits(123);
    cout << "\nNumber of digits in 12345 .. " << numberOfDigits(12345);
    cout << endl << endl;

    cout << "\nPress Enter to continue ... ";  cin.ignore(80, '\n');
}


//Function definition section
//Definitions must be in the same order as the prototypes.
void DoSomething
(
    int numberOfPositions,   //in
    char& firstInitial,      //inout
    string& stringOfInitials //out
)
{
    stringOfInitials = string(numberOfPositions, firstInitial);
    firstInitial = (char)(((int)firstInitial)+numberOfPositions);
}


int numberOfDigits
(
    int n //in
)
{
    int count = 0;
    do
    {
        n /= 10;
        ++count;
    }
    while (n != 0);
    return count;
}