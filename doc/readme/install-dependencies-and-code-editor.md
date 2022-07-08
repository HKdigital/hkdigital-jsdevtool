
# Install dependencies and code editor

## Install dependencies

The scripts use `git` and `nodejs (npm, npx)`, make sure you have that configured on your system before using this project.

### git
Follow the instructions on [git-scm.com](https://git-scm.com/).

### Node.js
Follow the instructions on [NodeJS.org](https://nodejs.org/`)

#### NPM
The NodeJs package manager will be installed along with NodeJS. 

To upgrade NPM to the latest version:

```bash
sudo npm install -g npm@latest
```

### n (optional)
The nodejs version manager `n` is also recommended so you can test your NodeJs scripts against different NodeJs versions, see [github tj/n](https://github.com/tj/n).

```bash
npm install -g n
```

To remove all previous NodeJs installations except from the latest:

```bash
n prune
```

To install the latest and the latest lts version of NodeJs

```bash
n lts
n latest
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
