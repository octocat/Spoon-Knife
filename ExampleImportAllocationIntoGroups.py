import pandas as pd

df= pd.read_excel('https://docs.google.com/spreadsheets/d/e/2PACX-1vTt2zTAl0BKc4VO8SZwexi2sHjAwryHhxEvgTHDpqYaZRFULG4ykJuiwTXSk9xEEJ4eWlpmRxBT_GrW/pub?output=xlsx')

name="What is your name?"
email="What is your email?"

# Shuffle the order of the participants
df = df.sample(frac=1).reset_index(drop=True)

# Split participants into groups of 3 or fewer
groups = []
while len(df) > 0:
    group_size = min(3, len(df))
    group = df.iloc[:group_size]
    groups.append(group)
    df = df.iloc[group_size:]

# Print the groups
for i, group in enumerate(groups):
    print(f"Group {i+1}:")
    for participant in group[name]:
        print(participant)
    print("\n")