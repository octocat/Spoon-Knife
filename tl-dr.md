### Forkit to YOUR github
-  On GitHub, navigate to the *original* repository.
-  Fork button In the top-right corner of the page, click Fork.

### Clone it locally
git clone https://github.com/YOUR-USERNAME/ \<reponame\>

### Set original repo as upstream
- show local's remotes: 
git remote -v
- add upstream repo:
git remote add upstream \<https to original repo\>

### get remote upstream to local
pull = fetch & merge 
git pull upstream master
 OR
git fetch upstream master
git merge upstream/master

### create a local branch to work in
git branch myBranch

### commit local changes
git commit ....

### when ready to push to upstream
git push 
