(*) How to Fork a repository:
		
	(1).Open GitHub, navigate to the repository which you want to fork 
	(2).Open the repository, then in the top-right corner of the page you find "fork"-button   click on that fork button,then  	     		repository will be forked into your git hub profile  
	(3).keep your fork synced :
				1.create local clone of your fork : navigate to your fork repository ,click on "code" button and copy the 									url then
									(1).open git bash
									(2).type " git clone -copied url-" then press enter
									(3).Type " git remove -v" and press enter ,you will see the 										current configured remote repository for your fork
									(4).Type git remote add upstream, and then paste the URL you 												copied in Step 2 and press Enter. It will look like this:											$ git remote add upstream 															https://github.com/octocat/Spoon-Knife.git												(5).to verify the new upstream repository you'have specified for 											your fork,type "git remote -v "
			In this way you can fork a repository and make a clone of repository into local repository
