1. Click fork on the website
2. Go to the forked repo page of my account, `git clone` it
3. Add a remote `git remote add upstream <URL>`
    * `upstream` is the popular name for the original remote
4. Syncing a fork
    1. Fetch the branches and their respective commits from the upstream repo: `git fetch upstream`. Commits to `master` will be stored in a local branch, `upstream/master`
    2. Checkout out your fork's local `master` branch: `git checkout master`
    3. Merge the changes from `upstream/master` into your local master branch. This brings your fork's `master` branch into sync with the upstream repository, without losing your local changes: `git merge upstream/master`
        * If your local branch didn't have any unique commits, Git will instead perform a "fast-forward"
    4. Tips: Syncing your fork only updates your local copy of the repo. To update your fork on GitHub, you must push your changes.
5. Pull request
    1. 
