import turtle
import random

#Falling Sakura Flowers

# Function to draw a single petal
def draw_petal(t, radius):
    t.color("#FF7F7F")  # Pink
    t.begin_fill()
    t.circle(radius, 60)
    t.left(120)
    t.circle(radius, 60)
    t.left(120)
    t.end_fill()

# Function to draw a Sakura flower
def draw_sakura_flower(t):
    for _ in range(6):
        draw_petal(t, 20)  # Adjust petal size as needed
        t.right(60)

# Function to create a new Sakura flower
def create_sakura(turtle_list, height):
    t = turtle.Turtle()
    t.penup()
    t.goto(random.randint(-300, 300), random.randint(0, height))
    draw_sakura_flower(t)
    turtle_list.append(t)

# Function to move the Sakura flowers down
def move_down(turtle_list, step):
    for t in turtle_list:
        t.sety(t.ycor() - step)

def main():
    screen = turtle.Screen()
    screen.setup(width=800, height=600)
    screen.bgcolor("#87CEEB")  # Light Sky Blue

    turtle_list = []
    num_sakura = 22

    # Create initial Sakura flowers
    for _ in range(num_sakura):
        create_sakura(turtle_list, 300)

    while True:
        move_down(turtle_list, random.randint(1, 4))

        # Check if flowers have reached the bottom, if so, reset their positions
        for t in turtle_list:
            if t.ycor() < -300:
                t.clear()
                t.hideturtle()
                t.goto(random.randint(-300, 300), 300)

        screen.update()

    screen.mainloop()

if __name__ == "__main__":
    main()


#  First Attempt 
# def sakura_flower():
#    print("    *    ")
#    print("  ***  ")
#    print("*******")
#    print("  ***  ")
#    print("  ***  ")
#    print("   *   ")
# sakura_flower()
