import random

# define conversation starters file(s)
questions = 'questions.txt'
jokes = 'jokes.txt'
activities = 'activities.txt'

# Open the conversation starters file and read the lines
with open(questions, 'r') as file:
    questions = file.readlines()

# Open the conversation starters file and read the lines
with open(jokes, 'r') as file:
    jokes = file.readlines()

# Open the conversation starters file and read the lines
with open(activities, 'r') as file:
    activities = file.readlines()

# Shuffle the conversation starters
random.shuffle(questions)
random.shuffle(jokes)
random.shuffle(activities)

# Random conversation starter
questions = random.choice(questions).strip()
jokes = random.choice(jokes).strip()
activities = random.choice(activites).strip()

# add to email message
message = "Hello!"
message += f"Let's start with a joke!\n {jokes}\n"
message += f"Here's your conversation starter:\n {questions}\n" 
message += f"We included an activity idea as well! You all should:\n {activities}" 

