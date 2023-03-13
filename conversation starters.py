import random

# define conversation starters file(s)
questions_file = 'questions.txt'
jokes_file = 'jokes.txt'
activities_file = 'activities.txt'

# Open the conversation starters file and read the lines
with open(questions_file, 'r') as file:
    questions = file.readlines()

# Open the conversation starters file and read the lines
with open(jokes_file, 'r') as file:
    jokes = file.readlines()

# Open the conversation starters file and read the lines
with open(activities_file, 'r') as file:
    activities = file.readlines()

# Shuffle the conversation starters
random.shuffle(questions)
random.shuffle(jokes)
random.shuffle(activities)

# Random conversation starter
random_question = random.choice(questions).strip()
random_joke = random.choice(jokes).strip()
random_activity = random.choice(activities).strip()

# add to email message
message = "Hello!"
message += f"Let's start with a joke!\n {random_joke}\n"
message += f"Here's your conversation starter:\n {random_question}\n" 
message += f"We included an activity idea as well! You all should:\n {random_activity}" 
