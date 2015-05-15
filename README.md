### Well hello there!

This repository is meant to provide an example for *forking* a repository on GitHub.

Creating a *fork* is producing a personal copy of someone else's project. Forks act as a sort of bridge between the original repository and your personal copy. You can submit *Pull Requests* to help make other people's projects better by offering your changes up to the original project. Forking is at the core of social coding at GitHub.

After forking this repository, you can make some changes to the project, and submit [a Pull Request](https://github.com/octocat/Spoon-Knife/pulls) as practice.

For some more information on how to fork a repository, [check out our guide, "Forking Projects""](http://guides.github.com/overviews/forking/). Thanks! :sparkling_heart:



### PASSOS BÁSICOS PARA COLABORAR EM PROJETOS OPEN SOURCE NO GITHUB

##### CRIANDO FORK (CRIANDO UMA CÓPIA DO REPOSITÓRIO OFICIAL NA MINHA CONTA DO GIT,)
ir a página oficial e clicar em 'fork'

##### CLONANDO O SEU REPOSITÓRIO (COPIANDO PARA O HD)
git clone https://github.com/YOUR-USERNAME/Spoo...

git remote -v

##### ADICIONANDO REPOSITÓRIO OFICIAL COMO FONTE PRINCIPAL DE ATUALIZAÇÕES

git remote add upstream https://github.com/octocat/Spoon-Knif...

git remote -v

##### SINCRONIZANDO HD COM REPOSITÓRIO OFICIAL

git fetch upstream
git checkout master
git merge upstream/master

##### SINCRONIZANDO O MEU REPOSITÓRIO GIT COM O MEU HD
git status
git add .
git commit -m "mensagem do commit"
git push
