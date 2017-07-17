1. Click fork on the website
2. Go to the forked repo page of my account, `git clone` it
3. Add a remote `git remote add upstream <URL>`
    * `upstream` is the popular name for the original remote
4. Syncing a fork: to fetch updates from the original remote
    1. Fetch the branches and their respective commits from the upstream repo: `git fetch upstream`. Commits to `master` will be stored in a local branch, `upstream/master`
    2. Checkout out your fork's local `master` branch: `git checkout master`
    3. Merge the changes from `upstream/master` into your local master branch. This brings your fork's `master` branch into sync with the upstream repository, without losing your local changes: `git merge upstream/master`
        * If your local branch didn't have any unique commits, Git will instead perform a "fast-forward"
    4. Tips: Syncing your fork only updates your local copy of the repo. To update your fork on GitHub, you must push your changes.
5. Pull request: tell the original repo the changes you've made
    1. If you're working in the shared repository model, we recommend that you use a **topic branch** for your pull request. While you can send pull requests from any branch or commit, with a topic branch you can push follow-up commits if you need to update your proposed changes.
    2. When pushing commits to a pull request, don't force push. Force pushing can corrupt your pull request.
    3. After initializing a pull request, you'll see a review page that shows a high-level overview of the changes between your branch (the compare branch) and the repository's base branch. You can add a summary of the proposed changes, review the changes made by commits, add labels, milestones, and assignees, and @mention individual contributors or teams. 
    4. By default, pull requests are based on the parent repo's default branch
    5. Click **Compare changes**, then choose the repos when necessary
        * **base branch**: where changes should be applied
        * **head branch**: your branch, it contains what you would like to be applied
        * you can also change notifications for the pull requests. Everyone that can push to the base repo will receive an email notification and see the new pull request in their dashboard the next time they sign in
        * Using the compare view, you can set up comparisons across any timeframe.
    6. In general, the steps can be as follows
        1. click **New pull request**
        2. use compare branch
        3. type a title and description for your pull request
        4. click **create pull requsst**
6. After your pull request has been reviewed, it can be [merged into the repo](https://help.github.com/articles/merging-a-pull-request/)
