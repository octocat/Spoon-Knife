import string
import random


alphabet = string.ascii_lowercase
phrase = ""


while phrase != "hello world":
    count = 0
    characters = []

    while count < 10:
        char = random.choice(alphabet)
        characters.append(char)
        count += 1

    characters.insert(5, " ")
    phrase = ''.join(characters)


print(phrase)

