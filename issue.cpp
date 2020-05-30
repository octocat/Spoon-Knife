#include <stack>

#include "include/basket.hpp"

int main(int argc, char* argv[])
{
    /* I had to use a stack for some reason */
    std::stack<std::string> stack_o_strings;
    
    /* Put some stuff in the stack for some reason! */
    stack_o_strings.push("this");
    stack_o_strings.push("is");
    stack_o_strings.push("a");
    stack_o_strings.push("stack");

    /* Time to pop off! */
    while (!stack_o_strings.empty())
    {
        std::cout << "Pop! " << stack_o_strings.top() << std::endl;
        stack_o_strings.pop();
    }

    std::cout << "Who needs printf!" << std::endl;
    std::cout << "when you got fancy iostream carrots!!" << std::endl;
    std::cout << "mmm.. carrots" << std::endl;


    /* Create a delicious basket of fruit */
    Basket fruitBasket;

    Fruit* banana = new Fruit;
    banana -> name = "banana";
    banana -> color = "yellow";
    banana -> tasteRating = 7;
    fruitBasket.pushFruit(banana); 

    Fruit* mango = new Fruit;
    mango -> name = "mango";
    mango -> color = "orange";
    mango -> tasteRating = 9;
    fruitBasket.pushFruit(mango); 

    Fruit* apple = new Fruit;
    apple -> name = "apple";
    apple -> color = "red";
    apple -> tasteRating = 5;
    fruitBasket.pushFruit(apple);
    
    /* Get the FRUIT INFO! */
    fruitBasket.printContents();
    fruitBasket.getRating("banana");
    fruitBasket.getRating("Pineapple");

    return 0;
}
