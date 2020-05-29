#include <iostream>
#include <stack>
#include <string>

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

    return 0;
}
