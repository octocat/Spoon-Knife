import System.Environment

-- output function 
openDoor div1 div2 divend
 | divend `mod` div1 == 0 && divend `mod` div2 == 0  	= "FIZZBUZZ"
 | divend `mod` div1 == 0     							= "FIZZ"
 | divend `mod` div2 == 0     							= "BUZZ"
 | otherwise 											= show divend

-- assignment of arguments to type Integer
main = do
 args <- getArgs
 --TODO error handle non-integers
 let div1 = (read $ args!!0 :: Integer) 
 let div2 = (read $ args!!1 :: Integer) 
 let maxDiv = (read $ args!!2 :: Integer) 

 -- prints list comprehension of result for 1 to maximum-dividend range
 mapM_ putStrLn [openDoor div1 div2 divend | divend <- [0..maxDiv]]

 --TODO unit tests