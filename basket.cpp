#include "include/basket.hpp"

/*
 *  Basket class member functions
 */

Basket::Basket() {}

void Basket::printContents()
{
    std::cout << "\nFRUIT REPORT:" << std::endl;
    for (auto it = content.begin(); it != content.end(); it++)
    {
        std::cout << (*it) -> name << std::endl;
    }
}

void Basket::pushFruit(Fruit* type)
{
   content.push_back(type); 
}

int Basket::getRating(std::string fruitName)
{
    for (std::vector<Fruit*>::iterator it = content.begin();
            it != content.end();
            it++)
    {
        std::string currentFruit = (*it) -> name;
        if (fruitName.compare(currentFruit) == 0)
        {
            std::cout << '\n' + fruitName << " has rating " << (*it) -> tasteRating << std::endl;
            return 1;
        }
    }
    std::cout << fruitName << " is not in your basket!!" << std::endl;
    return 0;
}

Basket::~Basket() {}
