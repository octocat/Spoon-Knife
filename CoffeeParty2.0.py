import random

# define conversation starters file(s)
questions_file = 'questions.txt'
jokes_file = 'jokes.txt'
activity_file = 'activity.txt'

# Open the conversation starters file and read the lines
with open(questions_file, 'r') as file:
    questions = file.readlines()

# Open the jokes file and read the lines
with open(jokes_file, 'r', encoding='utf-8') as file:
    jokes = file.readlines()

# Open the activities file and read the lines
with open(activity_file, 'r') as file:
    activity = file.readlines()

# Shuffle the conversation starters
random.shuffle(questions)
random.shuffle(jokes)
random.shuffle(activity)

# Random conversation starter
random_question = random.choice(questions).strip()
random_joke = random.choice(jokes).strip()
random_activity = random.choice(activity).strip()

# Construct the message
message = "Hello everyone!\n\n"
message += "We are excited to let you know that you have been matched for a meeting.\n\n"
message += f"Here's your conversation starter:\n{random_question}\n\n"
message += f"And here's a joke to lighten the mood:\n{random_joke}\n\n"
message += f"Lastly, we thought you might enjoy doing this activity together:\n{random_activity}\n"

print(message)
