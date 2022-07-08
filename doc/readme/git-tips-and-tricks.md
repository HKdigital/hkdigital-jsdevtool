# Git tips and tricks

## Store your code on a remote git repository
First create an empty git project on e.g. [GitHub](https://github.com/) or [Bitbucket](https://bitbucket.org/).

- When creating the project: do not create a `.gitignore` file or a `README.md`!
- You need to choose a name for the default branch. `main` is a commonly used option.

Link your local project folder to the remote repository.

```bash
git remote add origin <remote-git-repository-url>

# e.g.
# git remote add origin 
```

Stage your code, commit your code and push it to the remote repository.

```bash
# Add all files to the git index:
# - defines the content that will be added to the next commit
git add .

# Commit
# - creates a version of your code
git commit

# Rename the current branch to `main`
# - main is a good name for a default / first branch
git branch -M main

# Push the branch to the remote server
# - pushes to the server specified by `git remote add`
# - use `git remote -v` to check the url
git push origin main -u
```