#!/usr/bin/env python
# coding: utf-8

# In[3]:


import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Create a list to store the bigrams
bigrams = []

# Read the text file
with open('The Time Machine.txt', 'r', encoding = 'utf8') as f:
    text = f.read()
    
# Split the text into words
words = text.split()

# Loop through the words and create a list of bigrams
for i in range(len(words) - 1):
    bigram = (words[i], words[i + 1])
    bigrams.append(bigram)

# Create a dataframe from the list of bigrams
df = pd.DataFrame(bigrams, columns=['bigram1', 'bigram2'])

# Count the frequency of each bigram
bigram_counts = df.groupby(['bigram1', 'bigram2']).size().reset_index(name='frequency')


# Create the pivot table
matrix = bigram_counts.pivot_table(index='bigram1', columns='bigram2', values='frequency', fill_value=0)

# Get a list of all bigrams
indexes = matrix.index.union(matrix.columns)

# Reindex the matrix to include all bigrams
matrix = matrix.reindex(index=indexes, columns=indexes, fill_value=0)

# Convert the values to float
matrix = matrix.astype(np.float64)

# Apply thresholding
threshold = 1
matrix[matrix < threshold] = 0

# Plot the heatmap
sns.heatmap(matrix, cmap='Reds')
plt.show()


# In[ ]:





# In[ ]:




