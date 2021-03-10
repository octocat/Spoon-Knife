### Here we are going to use a 2 step approach,
## The first involves obtaining a dataset where the plasmodium == 1
## Then the second step will entail getting the unique pids not contained in the first 
##dataset and then getting the maximum date of the plasmodium == 2

## In the file below have explained bit by bit using a very simple example
library(data.table)
library(data.table
library(dplyr)
library(data.table)
library(dplyr)
library('readxl') ## importing the excel file
pract_1 <- read_excel("practice.xlsx")
#View(pract_1)
pract_1$date_taken <- as.Date(pract_1$date_taken,format="%m/%d/%y") ## make sure that you convert
## convert the date_taken column in a date format, this will ensure you can easily get the max &
## min dates, for the plasmodium == 1 (the earliest date is the minimum date)

pract_2 <- pract_1 %>% group_by(pid) %>% filter(plasmodium == 1) ## Filter the rows
#with plasmodium == 1, it will return every row where (plasmodium == 1)

pract_3 <- pract_2 %>% group_by(pid)%>% filter(date_taken==min(date_taken))
## with the grouped pids, filter the row where the date is minimum (earliest date)

a<-pract_3$pid  ## create a vector of unique pids that have (plasmodium == 1)


####### Second step

sec_pract_1 <- read_excel("practice.xlsx") ## Read the initial dataset again here,
#View(sec_pract)
sec_pract_1$date_taken <- as.Date(sec_pract_1$date_taken,format="%m/%d/%y") ##format the 
## date_taken column as the first step

sec_pract_2 <- sec_pract_1 %>% group_by(pid) %>% filter(! pid %in% a) %>% 
  filter(date_taken==max(date_taken)) ### Here, we first group all the pids, then
## we filter the pids that are not contained in the (a), the unique pids of the first step
## Then we filter again the most recent date (max_date in our case)

##View(sec_pract_3)


##Combine the two datasets using the rbind() 

data_new <- rbind(pract_3,sec_pract_2)
View(data_new)

