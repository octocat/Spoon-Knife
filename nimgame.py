import random
import sys

random.seed()
num_heap = 2 * random.randrange(3) + 3
i = num_heap
sum_list = []
heap_size = ''

#init
while i > 0:
    init_heap = 2 * random.randrange(3) + 9
    sum_list.append(init_heap) 
    heap_size = heap_size + str(init_heap) + " "
    i = i - 1
print('Created ' + str(num_heap) + ' heaps of sizes ' + heap_size)

#Decide first player
player = random.choice(['human','computer']);
if player =='human':
    print('Player human goes first')
else:
    print('Player computer goes first')

#Playing
while 1:
    
    if player == 'computer':
        select_heap = random.randrange(num_heap)
        while sum_list[select_heap] == 0:
            select_heap = random.randrange(num_heap)
        move_heap = random.randrange(sum_list[select_heap]) + 1
        sum_list[select_heap] = sum_list[select_heap] - move_heap
        print'Player computer took %d objects from heap %d' % (move_heap, select_heap + 1);
        sum_string = ''
        for i in range(len(sum_list)):
            sum_string = sum_string + str(sum_list[i]) + ' '
        print sum_string

        player = 'human'

    else:
        
        input_word = raw_input('Player human enter the number of objects (Y) to take from what heap (X)- in order: Y X\n')
        input_list = [x for x in input_word.split()]
        
        #user input check
        if len(input_list) < 2:
            move_heap = 'a'
        else:
            move_heap = input_list[len(input_list) - 2]
        select_heap = input_list[len(input_list) - 1]
        
        if len(input_list) > 2:
            next_heap = input_list[len(input_list) - 3]
            if next_heap.isdigit():
                move_heap = 'a' 


        while not move_heap.isdigit() or not select_heap.isdigit() or int(select_heap) > num_heap or int(select_heap) <= 0 or int(move_heap) > sum_list[int(select_heap) - 1] or int(move_heap) <=0:
            print('Player human that is an invalid move, try again')           
            input_word = raw_input('Player human enter the number of objects (Y) to take from what heap (X)- in order: Y X\n')
            input_list = [x for x in input_word.split()]
            if len(input_list) < 2:
                move_heap = 'a'
            else:
                move_heap = input_list[len(input_list) - 2]

            if len(input_list) > 2:
                next_heap = input_list[len(input_list) - 3]
                if next_heap.isdigit():
                    move_heap = 'a'     

            select_heap = input_list[len(input_list) - 1]
            sys.stdin.flush()


        sum_list[int(select_heap) - 1] = sum_list[int(select_heap) - 1] - int(move_heap)

        sum_string = ''
        for i in range(len(sum_list)):
            sum_string = sum_string + str(sum_list[i]) + ' '
        print sum_string

        player = 'computer'


    if sum_list == [0 for i in range(num_heap)]:
        if player == 'human':
            print('Player computer has won')
        else:
            print('Player human has won')

        sys.stdout.flush()
        break

