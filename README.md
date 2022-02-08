# Setup and manage Javascript projects

## About

This project contains scripts, config and other code that can be used to setup and manage Javascript projects. There are scripts and setups for both `frontend` development, as well as for `backend` projects.

The scripts should work on OS'es with `linux like` shells (including Mac OS).

## Status

This project is under development.

### What works
- Setup script `setup-nodejs-backend.mjs` creates a NodeJS program setup
- Setup script `setup-svelte-frontend.mjs` creates a SVELTE frontend setup
- The installed `devtool.mjs` can be used to `run`, `build` and `preview` your project
- The installed `devtool.mjs` can be used to install (merge) dependencies recursively from `package.json`'s found in the lib folder.

### What's missing
- Manage git submodules using `devtool.mjs`
- ...

## Install dependencies

The scripts use `git` and `nodejs (npm, npx)`, make sure you have that configured on your system before using this project.

### git
Follow the instructions on `https://git-scm.com/`

### Node.js
Follow the instructions on `https://nodejs.org/`

### n
The nodejs version manager `n` is also recommended so you can test your NodeJs scripts against different NodeJs versions.

```bash
npm install -g n
```

@see https://www.npmjs.com/package/n


## Create a project from scratch

### Create a project folder and install the devtool
Open a terminal, create a project folder, goto that folder and install the devtools into the subfolder `hkdigital-devtool`.

```bash
mkdir my-project
cd my-project
npx degit git@github.com:HKdigital/hkdigital-devtool.git hkdigital-devtool
```

### Option 1: setup a SVELTE frontend project
Run the frontend setup script.

```bash
./hkdigital-devtool/setup-svelte-frontend.mjs
```
### Option 2: setup a NodeJS backend project
Run the backend setup script.

```bash
./hkdigital-devtool/setup-nodejs-backend.mjs
```

## Next steps
Checkout the `README-DEVTOOL.md` that was installed in yout project's root folder
