#Learning how to fork, clone, edit, and push:

import pandas as pd
import numpy as np

data = np.ones((2,2))
df = pd.DataFrame(data)
df.to_csv('output.csv')
print('you just made a new csv file!')