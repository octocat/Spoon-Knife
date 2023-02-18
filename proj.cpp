/** @file proj.cpp
@author Lastname:kondepudiFirstname:ksk A00123456:cscxxxxx
@version Revision 1.1
@brief Illustrates doxygen-style comments for documenting a C++
program file and the functions in that file.
@details If you want to add any further detailed description of
what is in the file, then place it here (after the first statement)
and it will appear in the detailed description section of the HTML
output description for the file.
@date Monday, September 19, 2011
*/


#include <iostream>
using namespace std;

int main() {
  int n; ///a random number

  cout << "Enter an integer: ";
  cin >> n;

  if ( n % 2 == 0) ///check for divisibility by2
    cout << n << " is even.";
  else
    cout << n << " is odd.";

  return 0;
}