#include <iostream>

void __attribute__ ( ( noinline ) )
  cool( char *string )
  {
    if( *string )
      {
        cool( string + 1 );
        std::cout << *string;
      }
  }

auto
  main( void ) -> int
  {
    char input[] = "!dlroW olleH";
    std::cout << "String before reversing: ";

    for( auto iterate : input )
        std::cout << iterate;
    std::cout << "\n";

    std::cout << "String after reversing: ";
    cool( input );
    std::cout << "\n";
    return 0;
  }
