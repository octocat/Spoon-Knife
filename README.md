### Well hello there!

This repository is meant to provide an example for *forking* a repository on GitHub.

Creating a *fork* is producing a personal copy of someone else's project. Forks act as a sort of bridge between the original repository and your personal copy. You can submit *Pull Requests* to help make other people's projects better by offering your changes up to the original project. Forking is at the core of social coding at GitHub.

After forking this repository, you can make some changes to the project, and submit [a Pull Request](https://github.com/octocat/Spoon-Knife/pulls) as practice.

For some more information on how to fork a repository, [check out our guide, "Forking Projects""](http://guides.github.com/overviews/forking/). Thanks! :sparkling_heart:


### Notes

**Forks** act as a sort of bridge between the original repository and your personal copy. You can submit **Pull Requests** to help make other people’s projects better by offering your changes up to the original project. Forking is at the core of social coding at GitHub.

Make sure you configure your global editor in git to an program like VS Code. This is good to set for a diff tool (particularly when you have a merge conflict).

For example, <a href="https://code.visualstudio.com/docs/editor/versioncontrol#_vs-code-as-git-editor">set Visual Studio Code as git editor</a>

### Commit and Push

Create a snapshot and push to forked repo.

1. After you change a file: **git add filename** to get a snapshot of changes ready for the next commit (puts in staging area). Make sure to git add after any edits to your files.
2. **git status** - check the modified files are green
3. **git commit -m "my commit message"** - add commit with inline message
4. **git status** - shows this output:

On branch master
Your branch is ahead of 'origin/master' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean

4. **git push origin master** - push the master branch commit to your repo (origin alias) that you want use to initiate a pull request to the original repo that you forked from.

### Using version control in a team

Github is decentralized development. When you push your code, it is reviewed after you send a pull request.

Use **git pull** before you start working. Otherwise, you probably don’t have the latest version as your starting point — you’re editing an old version of the code! If you are up to date, you won't cause a problem with merge conflicts (although it might help you and do a diff to show you what you need to fix?? todo: try something like this out). 

The full command is **git pull origin master**: It pulls the commit from the **origin** remote, **master** branch and merges them to the local checked-out branch.

**git diff --staged** - review what you have added to staging area

todo: set up some automated tests triggered after push. Maybe even auto-rollback a commit before pushed.
