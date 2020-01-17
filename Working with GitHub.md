## Working with GitHub

## Creating Forked Repository

Creating a **fork** creates a personal copy of someone else's project. You can make changes to your local copy and contribute back to the original project by submitting Pull Requests. We'll cover pull requests in more detail later.

We're going to create a fork of the **tcadrt** repository created by **VandyVRC**.

* Navigate to the main page for the **tcadrt** repository in GitHub; you cannot fork a repository from GitHub Desktop. Click the **Fork** button in the header of the repository. This will create an exact duplicate of VandyVRC's tcadrt repository under your own GitHub username.

![Imgur](http://i.imgur.com/Bi0jTS8.png)

Currently your fork of the tcadrt repository only exists in the GitHub web client, but we need to clone it to your computer.

## The GitHub Desktop Client

The GitHub desktop client gives flexibility in how you can interact with the documents and files within our repository.

Download GitHub Desktop (available for MAC and PC), [https://desktop.github.com/](https://desktop.github.com/).

### Setting up GitHub Desktop

Add your GitHub.com account information to GitHub Desktop to access your repositories. Open GitHub Desktop and click on **Options** in the file menu

![Imgur](https://i.imgur.com/5oXCqd9.png)

In the **Accounts** tab, sign in to your GitHub.com account.  You can also opt to sign in via your browser. If you have two-factor authentication enabled, you will be prompted to authenticate.

![Imgur](https://i.imgur.com/xnlewp0.png)

Next, click on the **Git** tab to add your email address.  GitHub Desktop will use the email address you set in your local Git configuration to connect Commits with your GitHub account.  Locate your email address in GitHub by going to account settings and clicking on **Email**. *Note: I prefer to kept my email private and use a no-reply email address supplied by GitHub*.

![Imgur](https://i.imgur.com/dwRoIOQ.png)


## Cloning Your Repository

Let's clone tcadrt to our GitHub Desktop.  You can clone a repository from GitHub Desktop or from the repository's main page on GitHub.

### Cloning a Repository from GitHub Desktop  

In GitHub Desktop, click on **File** and select **Clone repository**.

![Imgur](https://i.imgur.com/vXA7gNI.png)

This will open a dialog box where you have two options.  
1. From the **GitHub.com** tab
  * Select your repository from the available list and click Clone. *Note the local path; this is where your files will be stored on your computer*
2. From the **URL** tab
  * Paste/ type in the repository URL OR your GitHub username and repository. *Note the local path; this is where your files will be stored on your computer*

![Imgur](https://i.imgur.com/L7fFCTI.png)

Once you've successfully cloned the repository, all the repository files will be available to you on your desktop.  

### Care and Feeding of Your Cloned Repository  

After successfully cloning your forked repository, you will have two copies: 1) the local copy on your computer, and 2) your forked repository on GitHub (a.k.a **remote** or **origin**). Keeping these two copies in sync will be an important part of your workflow!

Why is syncing so important?  
1. Ensures that you are always working with an up to date repository.
2. Helps you avoid merge conflicts

When you open your repository in GitHub Desktop, it will automatically pull the latest version of your GitHub repository (**fetch origin**).  You can manually sync by clicking on the **fetch origin** button or by clicking on **Repository** and selecting **Pull**.

![Imgur](https://i.imgur.com/SbAty81.png?1)

When you're done working locally and have commits to push to your GitHub repository, the **Fetch origin** button will change to **Push origin**.  You can either click on the button or click on **Repository** and select **Push** to push your commits to your repository. More on commits later.

![Imgur](https://i.imgur.com/Y5XxN5M.png)

### Syncing your Forked Repository with the Upstream Master

In addition to syncing our local and web versions of our forked repository, we also need to keep in sync with the original VandyVRC/tcadrt repository or the upstream master.

Click on **current branch** in GitHub Desktop

![Imgur](https://i.imgur.com/J2tmmt7.png)

Click on **Choose a branch to merge into master**

![Imgur](https://i.imgur.com/3mj7A08.png)

A dialog box will open.  From the menu select **upstream/master**.  Then click on the blue button.  This will merge the upstream/master into the master branch on your repository.

![Imgur](https://i.imgur.com/Eo0vYJT.png)

### Committing Changes & Contributing to the upstream/master

After editing and saving the files in your repository you still need to **commit* your changes to save them to your repository. On GitHub, saved changes are called commits. Each commit has an associated commit message that describes the change being made and why. These commits document the history of the repository.

Go to the **Changes** tab in your repository.  Any additions or deletions are tracked in the Changes tab and this is also where you will commit your changes to the repository.

![Imgur](https://i.imgur.com/6tAW8Xi.png)

Give your commit a descriptive title and you can add more detail below.  Click the blue button to commit your changes to master.

![Imgur](https://i.imgur.com/Nx2gXD6.png)

Every commit is tracked in the **History** tab of your Repository

![Imgur](https://i.imgur.com/aA1llSN.png)

To contribute these changes back to the original repository, you'll need to create a pull request.

Click on **Branch** and select **Create pull request**.

![Imgur](https://i.imgur.com/54X05Co.png)

You will be taken to GitHub, where it will compare your forked copy of the repository with the upstream master.  Click on the green **Create pull request** button to continue.

![Imgur](https://i.imgur.com/eBF7t6d.png)

Add details to your pull request message, and click the green **Create pull request** button.

![Imgur](https://i.imgur.com/iWiqP4E.png)

You now have an open pull request!
