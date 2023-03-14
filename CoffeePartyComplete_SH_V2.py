import pandas as pd
import random #To use the random package


#Reading data from public online google sheets collecting responses from google forms
df= pd.read_excel('https://docs.google.com/spreadsheets/d/e/2PACX-1vTt2zTAl0BKc4VO8SZwexi2sHjAwryHhxEvgTHDpqYaZRFULG4ykJuiwTXSk9xEEJ4eWlpmRxBT_GrW/pub?output=xlsx')
#Creating new variables from headers
people="What is your name?"
email="What is your email?"


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

# extract names from the data frame and convert them to a list
people = df[people].tolist()


#Shuffels the list of participants to a random order
random.shuffle(people)


#This function uses the lists with the participants, coversation_starters, and jokes to create random coffee drink groups
# with a random joke and conversation starter


def group_allocation(people,questions, jokes, activity):
    
    min_group_size = 2  #To prevent people and up allone
    max_group_size = 5  #max size of the coffee group
    group_num = 1       #Starting number of the group key

    groups = {}         #dictonary to store the data

    while len(people) > 0:  #Loops until everybody is allocated to a group
        group_value =[]     #List that refreshes each round where the people, coverstation starter and joke is stored for a specific group
   
        #Chooses for each round a random number for the size of the group between the set min and max size
        group_size = random.randint(min_group_size, max_group_size) 


        #Checks how many people are left after the random group size is choosen 
        group_left = len(people) - group_size

        #If the group size chooses a number that resulted in somebody being left out, the loops starts again to create a new groupsize
        if group_left == 1:
            continue

        # If there are not enough people left to form a group of the chosen size, 
        # set the group size to the remaining number of people    

        if len(people) < group_size:
            group_size = len(people)


        # Take the first group_size people from the list of people and add them to a new group
        group = people[:group_size]

        # Remove the people in the group from the list of people
        people = people[group_size:]

        # Add the group to the list of group
        group_value.append(group)
        
        # Random conversation starter
        random_question = random.choice(questions).strip()
        random_joke = random.choice(jokes).strip()
        random_activity = random.choice(activity).strip()

        group_value.append(random_question)
        group_value.append(random_joke)
        group_value.append(random_activity)

        group_key = "Group " + str(group_num) #Creates the name of the dictonary key for example \"Group 1\"
 
        groups[group_key] = group_value #Combines the key with its value

        group_num += 1 #Increases the group number with one
  
    return groups #Returns the dictonary with the selected group, conversation starter, and joke


   




#Calls the function that randomly allocates the coffee drinkers with a joke and conversation starter\n",
groups = group_allocation(people,questions, jokes, activity)



### The program generates messages to all groups which address the participants by name, inform
## them about having been matched for a meeting, and include the conversation starter. It saves these
## messages in one text file

introtext = "" #Creates a blank script to add the group allocation to

#Loop that extracts the names of the group, there activity, joke, and question from the dictionary and 
#adds it to the text

        
for key, value in groups.items(): 
    group_members= value[0] #adds the groupmembers
    question = value[1]     #adds the question
    joke= value[2]          #adds the joke
    activity= value[3]      #adds the activity
    introduction = f"Hey {group_members}"
    introduction += ", you have been matched with each other for a coffee party! \n \n"
    introduction += f"Here's your conversation starter:\n{question}\n\n"
    introduction += f"And here's a joke to lighten the mood:\n{joke}\n\n"
    introduction += f"Lastly, we thought you might enjoy doing this activity together while:\n{activity}\n\n"
    introtext += introduction

with open("introduction.txt", "wb") as file:
    file.write(introtext.encode("utf8"))


