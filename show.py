'''Prints out the lines index.html'''

with open('index.html', 'r') as file:
    print(file.readlines())
    file.close()