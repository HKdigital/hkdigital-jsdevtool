# DevOps tool for NodeJS and SVELTE projects

## About

DevOps is the integration of development and software operations. This project can be used to integrate DevOps functionality into your javascript projects.

The project contains scripts to setup a `NodeJS` (backend) or a `SVELTE` (frontend) project. After installation the project will contain a `devtool`, which can be used for running, building and managing your project.

## Status

This project is under development, which means there will be bugfixes, improvements and new features will be added.

Support for Windows has been added recently. 
If you encounter problems or have a good idea to make this tool better, please create an [issue](https://github.com/HKdigital/hkdigital-jsdevtool/issues).

### Currently under development

- Dumping and restoring [ArangoDB](https://www.arangodb.com/) databases to and from disk
- Integration of [JEST](https://jestjs.io/) testing framework

## Install dependencies

The scripts use `git` and `nodejs (npm, npx)`, make sure you have that configured on your system before using this project.

### git
Follow the instructions on [git-scm.com](https://git-scm.com/).

### Node.js
Follow the instructions on [NodeJS.org](https://nodejs.org/`)

### n (optional)
The nodejs version manager `n` is also recommended so you can test your NodeJs scripts against different NodeJs versions, see [github tj/n](https://github.com/tj/n).

```bash
npm install -g n
```

### ArangoDB (optional, for use in NodeJS projects)
The devtool installed in NodeJS projects offers commands to dump and restore ArangoDB databases. If you wish to use this functionality, you must install ArangoDB on your computer.

Official instructions can be found here: [ArangoDB Installation](https://www.arangodb.com/docs/stable/installation.html).
On MacOS, the setup using [Homebrew](https://brew.sh/) package manager is quite easy.

```bash
brew install arangodb
```

## Code editor and terminal program

### Terminal program
On Mac OS you can use the built-in `Terminal` to run scripts. [iTerm2](https://iterm2.com/) can be configured more to your personal preferences.

### Code editor
Choose the editor that you like. Most editors support basic editing, linting (checking code for errors) and code completion nowadays.
- [Sublime Text](https://www.sublimetext.com/) is a stable and very fast editor.
- [Atom](https://atom.io/) is free and very extensible.
- [Visual Studio Code](https://code.visualstudio.com/) probably offers the easiest integrations, but slow and cumbersome.

## Create a project from scratch

### Create a project folder and install the devtool
Open a terminal, create a project folder, goto that folder and install the devtools into the subfolder `hkdigital-jsdevtool`.

```bash
mkdir my-project
cd my-project
npx degit git@github.com:HKdigital/hkdigital-jsdevtool.git hkdigital-jsdevtool
```

### Setup a SVELTE (frontend) project
- Open a terminal and go to the `hkdigital-jsdevtool` folder
- Run the setup script
- Go to the project root folder and run the installed `devtool` script to manage your project

```bash
cd hkdigital-jsdevtool
npm run setup-svelte
cd ..
node devtool.mjs
```

#### Open a browser

Use a browser and navigate to the displayed url, e.g. http://localhost:8888/.

#### Open the project folder with your code editor

Open the project folder with your code editor. You'll find a file 
[src/index.html], which is the starting point of your SVELTE application. The browser will live reload code changes you make.

### Setup a NodeJS (backend) project
- Open a terminal and go to the `hkdigital-jsdevtool` folder
- Run the setup script
- Go to the project root folder and run the installed `devtool` script to manage your project

```bash
cd hkdigital-jsdevtool
npm run setup-nodejs
cd ..
node devtool.mjs
```

#### Open the project folder with your code editor

Open the project folder with your code editor. You'll find a file 
[src/index.js], which is the starting point of your NodeJS application. The application will be restarted every time you make some changes to the code. If this is not what you like, simply stop the devtool and run it when you're done making changes.

## Next steps

### Read the `README-DEVTOOL.md`
A file called `README-DEVTOOL.md` is installed in your project's root folder after running one of the setup scripts.

### Store your code on a remote git repository
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

## Reinstallation or updating

If your project is missing the `hkdigital-jsdevtool` folder, e.g. after cloning the project from a repository, you will need to reinstall the folder.

Note that the `hkdigital-jsdevtool` folder is in the `.gitignore` file, so won't be added to your git project. So when you clone your project using git, you'll notice that the folder is missing.

If you want to update `hkdigital-jsdevtool`, you can safely remove the folder and reinstall it.

- Remove the existing folder
- Install a new `hkdigital-jsdevtools` folder
- Run `node devtool.mjs `

### Howto install missing `hkdigital-jsdevtool`

Run the following command in your terminal if your `hkdigital-jsdevtool` folder is missing.

```bash
npx degit git@github.com:HKdigital/hkdigital-jsdevtool.git hkdigital-jsdevtool
```

# Support cancer research

If you like our work and would like us to share some more code, please support us! 

Currently we're collecting money for cancer research:

Alpe d'HuZes is a unique sporting event where as much money as possible is raised for cancer research and for improving the quality of life of people with cancer. On a single day, 5000 participants will bike, hike or run the Alpe d'Huez. Attempting a maximum of six climbs, under the motto 'giving up is not an option'. 

https://www.opgevenisgeenoptie.nl/fundraisers/JensKleinhout
