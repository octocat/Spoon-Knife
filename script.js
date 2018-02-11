// // Zadanie 1

// console.log("Zadanie 1");

// var cars = ["Saab", "Volvo", "BMW"];

// for(var i = 0; i < cars.length; i++)
// {
// 	console.log(cars[i]);	
// }

// console.log("\n");

// // Zadanie 2

// console.log("Zadanie 2");

// var fruits = ["apple0", "apple1", "apple2", "apple3", "apple4"];

// for(var i = 0; i < fruits.length; i++)
// {
// 	if(i == 0)
// 		console.log(fruits[i]);	
// }

// console.log("\n");

// for(var i = 0; i < fruits.length; i++)
// {
// 	var last_element = fruits[fruits.length - 1];
// 	console.log(last_element);	
// }

// console.log("\n");

// for(var i = 0; i < fruits.length; i++)
// {
// 	console.log(fruits[i]);	
// }

// console.log("\n");

// // Zadanie 3

// console.log("Zadanie 3");

// var sum = 0;

// var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// for (var i = 0; i < arr.length; i++)
// {
// 	sum += arr[i];
// }

// console.log(sum);

// console.log("\n");

// // Zadanie 4

// console.log("Zadanie 4");

// var sum = 0;

// var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// for (var i = 0; i < arr.length; i++)
// {
// 	if (arr[i] % 2 == 0)
// 	{
// 		sum += arr[i];
// 	}
// }

// console.log(sum);

// console.log("\n");

// // Zadanie 5

// console.log("Zadanie 5");

// var max = 0;

// var arr = [4, 2, 5];

// for (var i = 0; i < arr.length; i++)
// {
// 	if (arr[i] > max)
// 	{
// 		max = arr[i];
// 	}
// }

// console.log(max);

// console.log("\n");

// // Zadanie 6

console.log("Zadanie 6");

var arrWithNumbers = [0, 1, 5, 2, 3, 5, 8, 2, 4];

var firstIndex = "";

var isMatch = false;

for (var i = 0; i < arrWithNumbers.length; i++)
{
	for (var j = i + 1; j < arrWithNumbers.length; j++)
	{
		if (arrWithNumbers[i] === arrWithNumbers[j])
		{
			firstIndex = arrWithNumbers.indexOf(arrWithNumbers[i]);
			isMatch = true;
			break;
		}
	}

	if(isMatch)	break;
}

console.log(firstIndex);

console.log("\n");

// Zadanie 7

// console.log("Zadanie 7");

// var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// for (var i = arr.length - 1; i >= 0; i--)
// {
// 	console.log(arr[i]);
// }