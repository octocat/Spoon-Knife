## Welcome!

This repository is meant to be used a tool to practice GitHub collaboration without worrying about messing up important files.

&copy; 2017 Sophie Opferman

[Workflow](https://github.com/TheFirstQuestion/Spoon-Knife#the-workflow) | [Glossary](https://github.com/TheFirstQuestion/Spoon-Knife#glossary) | [Sources](https://github.com/TheFirstQuestion/Spoon-Knife#sources) | [TLDR](https://github.com/TheFirstQuestion/Spoon-Knife#tldr)

### The Workflow

###### Rule #1: Anything in the `master` branch is able to be deployed at any moment.

What does this mean? Whenever you make **any** change (other than a bug fix), you need to create a new branch. Make sure that your branch is named descriptively, so that other people can know what you're doing.

Within your new branch, make any changes or updates that you want. Your branch does not impact the `master` branch in any way. Add commits to keep track of your changes, making sure your commit messages are descriptive.

When your branch is ready to add to `master` (read: production ready), you can submit a Pull Request. A Pull Request allows those in charge of the project to review your code and give you feedback before merging it with `master`. Make sure that your Pull Request is summarized with what changes you made and why. Your Pull Request will form part of the historical documentation of the project, so make sure it's detailed!

After submitting your Pull Request, you can still push commits to make changes. They will be seen in the Pull Request view. At this step, this is for bug fixes, typos, and especially to make sure your coding style matches the project guidelines.

When your Pull Request is approved, your code will be deployed to test it in production. If any issues occur in this step, you can roll back by deploying the existing `master`.

Once your code has successfully been tested in production, it can be merged into `master`.

Congratulations! You're done!


### Glossary

Make a new branch: `git branch -b new-branch-name`

Add files to the stage: `git add .`

Create a commit: `git commit -m "your message here"`



### Sources
http://product.hubspot.com/blog/git-and-github-tutorial-for-beginners

https://guides.github.com/introduction/flow/

http://nvie.com/posts/a-successful-git-branching-model/




## TLDR

`master` should always be deployable.

All names and messages should be descriptive--this goes for commit messages, pull requests, branch names, etc.

* Create a new branch
* Make your changes
* Make a Pull Request
* Accept feedback and make changes
* Deploy in production and test
* Merge into `master`
