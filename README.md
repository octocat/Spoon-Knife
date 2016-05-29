##INSTRUCTIONS

#### Challenge #1: The Sage of Fizz Buzz

To run the solution you will have to type ghci on CMD:

```ruby
ghci
```

The follow message will show up:
```ruby
GHCi, version 7.10.3: http://www.haskell.org/ghc/  :? for help
Prelude>
```

Then type the command below:
```ruby
:l <directory>
#Directory is where your solution is placed (example: C:/Users/rfc/desktop/challange1
```

After that, you will see that it changed from Prelude to Main
```ruby
*Main>
```

To run the solution, please enter the command below:
```ruby
*Main>start (2, 4, 6)
```
Output:
```ruby
["1","Fizz","3","FizzBuzz","5","Fizz"]
```

You can decide which numbers will be entered, but it has to be 3 numbers.

#### Challenge #2: The Nazgûl

For this chanllenge, I chose to work with Python and Rust.

**One interpreted, dynamically typed: Python**
```ruby
Python <solution.py> <argv>
#argv is where the file with the words is placed
```
Please, see the example below:
```ruby
Python <solution.py> <directory of the file>
#Example: Python c:/users/rfc/desktop/challenge2_python.py c:/Users/rfc/desktop/file.txt
```
Output:
```ruby
Directory:  c:/Users/rfc/desktop/file.txt
AY | 44332211
NAY | 98433200
NAY | zzpia
AY | pooiihhbbaa
NAY | uutssrnnllliihfeebaPI
AY | xnaaX
```

**And one compiled, statically typed: Rust**

To run the solution, please enter:

```ruby
rustc Challenge2_rust.rs -A warning
#-A warning is to hide the warning that show up when compiling the solution
```

The command above will compile the solution and now we have to run the executable by:

```ruby
./Challenge2_rust <directory>
### <directory> is where the file with word is placed
```
Example:
```ruby
./Challenge2_rust /home/rfc/Desktop/file.txt
```
Output:
```ruby
Directory: "/home/rfc/Desktop/file.txt"

AY | 44332211
NAY | 98433200
NAY | zzpia
AY | pooiihhbbaa
NAY | uutssrnnllliihfeebaPI
AY | xnaaX
```

