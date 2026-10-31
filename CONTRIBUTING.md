# Contributing to Spoon-Knife

This repository is a small practice project for learning GitHub forks and pull requests.

## Fork and propose a change

1. Fork `octocat/Spoon-Knife` to your GitHub account.
2. Clone your fork and add the original as the `upstream` remote.
3. Fetch `upstream/main`, then create a focused branch from it.
4. Make and inspect one small change. Keep unrelated files out of the commit.
5. Run any checks supplied by the project and review the diff with `git diff --check`.
6. Commit and push the branch to your fork.
7. Open a pull request from your branch to `octocat/Spoon-Knife:main`. Explain the change and include the checks you ran.
8. Respond to maintainer feedback. The upstream maintainer decides whether the pull request is accepted and merged.

## Example commands

```sh
git remote add upstream https://github.com/octocat/Spoon-Knife.git
git fetch upstream
git switch -c docs/fork-pull-request upstream/main
# edit files
git diff --check
git add CONTRIBUTING.md
git commit -m "docs: explain the fork and pull request workflow"
git push -u origin docs/fork-pull-request
```
