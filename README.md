# Howto setup hkdigital-devtool

## Status

**ALPHA 0.1**

```
This project is under development, has not been completed yet and may contain  bugs.
```

## About

This project contains scripts, config and other code that can be used to setup and manage your ES projects. There are scripts and setups for both `frontend` development, as well as for `backend` projects.

The scripts are intended to work on OS'es that support `linux like` shells (this includes Mac OS).

The scripts use `git` and `nodejs (npm, npx)`, make sure you have that configured on your system first.

### Install dependencies

#### git
Follow the instructions on `https://git-scm.com/`

#### Node.js
Follow the instructions on `https://nodejs.org/`

#### n
The nodejs version manager `n` is also recommended so you can test your nodejs scripts against different Node.js versions.

```bash
npm install -g n
```

@see https://www.npmjs.com/package/n


## Create a project from scratch

### Create a project folder and install the devtool
Open a terminal, create a project folder, goto that folder and install the devtools.

```bash
mkdir my-project
cd my-project
npx degit --mode=git git@bitbucket.org:hk-digital/hkdigital-devtool#main
```

@note `--mode=git` is (only) needed for private repositories

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
Checkout the `README.md` that was installed in yout project's root folder
