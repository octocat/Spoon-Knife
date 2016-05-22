-- Challange1

import Data.List
import System.IO

isdivisible :: Int -> Int -> Int -> String
isdivisible f s u = 
	if (u `mod` f == 0 && u `mod` s == 0 )
		then "FizzBuzz" 
	else if (u `mod` f == 0)
		then "Fizz"
	else if (u `mod` s == 0)
		then "Buzz"
	else  show u

start :: (Int, Int, Int) -> [String]
start (f,s,upper) = map (isdivisible f s) [1..upper]
	
