#ifndef BASKET_H
#define BASKET_H

#include <vector>
#include <string>
#include <iostream>

/*
 *  Fruit struct
 */
typedef struct 
{
    std::string name;
    std::string color;
    int tasteRating;
} Fruit;

/*
 *  Lets make a basket full of delicious fruits
 *
 */
class Basket
{
    private:
        std::vector<Fruit*> content;

    public:
        Basket();
        void printContents();
        int getRating(std::string fruitName);
        void pushFruit(Fruit* type);
        ~Basket();
};

#endif
