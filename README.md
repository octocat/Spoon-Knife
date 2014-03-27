### Well hello there!

This repository is meant to provide an example for *forking* a repository on GitHub.

Creating a *fork* is producing a personal copy of someone else's project. Forks act as a sort of bridge between the original repository and your personal copy. You can submit *Pull Requests* to help make other people's projects better by offering your changes up to the original project. Forking is at the core of social coding at GitHub.

After forking this repository, you can make some changes to the project, and submit [a Pull Request](https://github.com/octocat/Spoon-Knife/pulls) as practice.

For some more information on how to fork a repository, [check out our guide, "Forking Projects"](http://guides.github.com/overviews/forking/). Thanks! :sparkling_heart:

==============================
(personal notes below from @jtuki ...)

##### Play around some feature of Git and Github.

1. Pretty lightweight `branch` compared with Subversion.
2. `merge` from other `branch` and resolve the conflict.
3. `commit` to branches (eg. `master` and `branch_noise`).
4. `push` local commit(s) to `origin` (which is hosted on Github).
5. `compare and review` and `send pull request` (directly from Github) to the original author @octocat.

##### Short tutorial on _How to make the conflict happen?_

1. `checkout`/`switch` to `branch_noise` branch.
2. Make some changes to line `jtuki: ...` above, `commit`.
3. `checkout`/`switch` to `master`.
4. Make some changes to the same line `jtuki: ...` (with different changes of step 2), `commit`.
5. Try to `merge` `master` and `branch_noise`. Congratulations, **conflict** occurs.
