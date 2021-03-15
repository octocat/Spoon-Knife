##------------------------------------------------
# A simplified code from your main code,
# have used a modified version of the simple dataset that I created the other time
# the code returns results for every patient id, one row,
# if you want to to obtain results for every row, then you can just replicate it
rm(list=ls())
library(reshape)
library(reshape)
library(tidyverse)
library(broom)
library(dplyr)
library('readxl') ## importing the excel file
#Start of my code -------------------------------------------
BSPZV_all <- read_excel("practice.xlsx")
linear_model = BSPZV_all %>% 
  group_by(pid)%>% 
  do(tidy(lm(var ~ var2, .))) 
linear_model=linear_model%>% filter(term=='var2') %>%
as.data.frame()
# End of my code -----------------------------------------------------
   
 # your code --------------------------------------------------------     
linear_model = BSPZV_all %>% 
  group_by(PATID) %>% 
  do(tidy(lm(qpcr_density ~ prepatent_p, .))) %>% 
  mutate(Beta = as.character(round(estimate, 87)), "P Value" = round(p.value, 87), SE = round(std.error, 87)) %>% 
  select(Beta, SE, "P Value") %>% 
  as.data.frame()

##### I get the following error from the above code on the Console

#Error in model.matrix.default(mt, mf, contrasts) : 
 # variable 1 has no levels