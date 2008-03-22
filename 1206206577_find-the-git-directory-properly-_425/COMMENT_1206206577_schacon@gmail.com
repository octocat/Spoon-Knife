look for GIT_DIR and then look for the .git directory recursively
also, open it bare - we shouldn't need the original working directory
