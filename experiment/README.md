## README

## Quiz
### 1. Introduction
This part of the experiment is specifically for assessment purposes. This allows for the creation of a quiz with multiple choice single answer questions.  
These can be
* Pretest - Pre requisite quizzes
* Posttest - Testing the learning
* Learning Unit Quizzes - Quizzes to test the section's learning.
The format for the same is discussed below.

### 2. Target Audience
This guide is meant for anyone creating a virtual lab and wanting to have a quiz section.

### 3. Structure of quiz
The data for the quiz needs to be added to a json file pertaining the following specifications.
1. The quiz needs to have an array of objects, each object representing a question. As shown below
```
"questions" : [
    {
        "question" : "What is 1+2 ?",
        "answers" : 
        {
            "a" : 1,
            "b" : 2,
            "c" : 3,
            "d" : 4
        },
        "correctAnswer" : c
    }
]
```
### 4. Quiz V2.0 (Enhancements done)
The new format of quiz has multiple new additions. The details for which have been described below.  
The format of json would be as linked [here](./pretest.json)  

First we will look at the additional fields added  

### 4.1 Fields 
* Mandatory Fields
    * [version](#42-version) - Without which the enhanced quiz will not be rendered. 
    * [levels](#44-levels) -  Adds difficulty level to each question (Allows for filtering)

* Optional Fields
    * [explanations](#43-explanations) - Adds an explanation to each answer. If wrong answer is choosen, only it's explanation pops up.  If correct answer is choosen, all available explanations pop up.  

### 4.2 Version
The very first field is absolutely necessary. This ensures that the quiz supports the new features.
```
"version": 2.0
```   

### 4.3 Explanations
Just like we mention answers, we can have a section for explanation so that they show up after an answer is marked. This is optional and can completely be left out. The three ways of defining (Assuming there are 4 answers a, b, c, d):

1. All answers have explanations
```
"explanations": {
    "a" : "Explanation 1,
    "b" : "Explanation 2"
    "c" : "Explanation 3"
    "d" : "Explanation 4"
},
```  
2. Some answers have explanations
```
"explanations": {
    "a" : "Explanation 1,
    "d" : "Explanation 4"
},
```

3. No answers have explanations
```
/* Can be excluded from json */
```  


### 4.4 Levels
Adds an ability to filter questions based on difficulty levels. This is mandatory and has to be mentioned for each question.  
The three available difficulty levels are:
```
['beginner', 'intermediate', 'advanced']
```
Using any other will not work. The format for the same:
```
"difficulty" : "beginner"
```

### 5. Tips
1. An extra functionality of explanation is the ability to add an Rich Text (HTML Formatted). It will work just like in html.  
This could be used for
    a. Adding hyper links
    b. Formatting text etc.
```
"explanations": {
    "a" : "Explanation 1  <a href='www.google.com'>here</a>",
    "b" : "Explanation 2"
},
```
> This can be done in either of explanation, answer and the question.
An example for the same can be found here: source | website

2. Multi Correct
To mimic the functionality of multi correct questions, one can add options as part of the question itself, and the actual answer options can be like : 
```
    "answers" : 
    {
        "a" : "both i and ii",
        "b" : "All i, ii, iii, iv",
        "c" : "Only i",
        "d" : "None of the above"
    }
```
An example for the same can be found here: source | website

### 6. Manual Validation of Quiz Json (wrt version 2.0)
This is till the automatic validation is set up.
* The first field has to be version with 2 or 2.0 as value.
* The questions needs to be an array of objects containing questions.
* Each question object should hav a question field, answers field, difficulty field and correctAnswer field.
    * question : Should be a string
    * answer : Should be an object containing options, and each option should be a string.
    * difficulty : should be a string and should have values from ["beginner", "intermerdiate", "advanced"]
    * correctAnswer : Should be a string and it's value should be present in keys of one of the answer.
* If explanation is present it has to be an object and needs to follow the description of answer object.  

### 7. Test Cases
- [x] Using the mentioned quiz format  
- [x] Using the old quiz json format
- [ ] Not including the version in json
- [ ] Including incorrect version in json 
- [ ] Including correct version but following old format 
- [x] Difficulty not mentioned
- [x] Incorrect difficulty level mentioned
- [x] explanation not provided for all options
- [x] explanation empty
- [x] explanation object not defined
- [x] HTML in quuestion (tags like hyper links, bold etc)
- [x] HTML in answer (tags like hyper links, bold etc)
- [x] HTML in explanation (tags like hyper links, bold etc)
- [x] On wrong annswer only wrong answer is colored red
- [x] On correct answer all red color resets
- [x] Combination of filters working properly
- [x] If all questions have same difficulty, filter option should be hidden.
- [x] When questions are answered after filtering, marks should be counted out of filtewred questions, not total.
- [x] On wrong answer only explanation of wrong answer is shown
- [x] On correct answer all available explanations are shown

### 8. TODO
* Add automatic schema validation
* Link to source files implementing the above tips.
