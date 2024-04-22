
<div align="center" style="text-align: center; ">
  <br>
  <br>
  <img alt="HKdigital" src="doc/doc-include/HKdigital-logo.svg" style="height: 100px;" />
  <br>
  <br>
</div>

<div align="center" style="text-align: center;">
<h1>DevOps tool for NodeJS and SVELTE projects</h1>
  <br>
</div>

## About

DevOps is the integration of development and software operations. This project can be used to integrate DevOps functionality into your javascript projects.

The project contains scripts to setup a `NodeJS` (backend) or a `SVELTE` (frontend) project. After installation the project will contain a `devtool`, which can be used for running, building and managing your project.

## Status

Since both NodeJs and SVELTE and other tools and dependencies are under constant development, this project also is under constant development.

* April 2024
Especially SVELTE has advanced a lot in version 4 and 5. This devtool currently only supports the "almost classic" version 3 of SVELTE. Please checkout the new ways to install SVELTE 4 and 5 before considering using this devtool.

* April 20234
The current setup includes a basic setup for the [JEST](https://jestjs.io/) testing framework. Note that SVELTE 4 and 5 now includes Vitest.

* March 2023
Support for Windows has been added. If you encounter problems or have a good idea to make this tool better, please create an [issue](https://github.com/HKdigital/hkdigital-jsdevtool/issues).

* March 2023
Dumping and restoring [ArangoDB](https://www.arangodb.com/) databases to and from disk. Note that the devtool requires arangotools (arangodb) to be installed on your system to work.

## Install dependencies

The `devtool` script has some dependencies that should be installed first on your system.

@see [Install dependencies and code editor](https://github.com/HKdigital/hkdigital-jsdevtool/tree/main/doc/readme/install-dependencies-and-code-editor.md)


## Create a project from scratch

### Create a project folder and install the devtool
Open a terminal, create a project folder, goto that folder and install the devtools into the subfolder `hkdigital-jsdevtool`.

```bash
mkdir my-project
cd my-project
npx degit git@github.com:HKdigital/hkdigital-jsdevtool.git hkdigital-jsdevtool
```

### (Option 1) Setup a SVELTE frontend project
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

### (Option 2) Setup a NodeJS backend project
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

## Next steps

If you want to learn about the subcommands of the devtool, just run the script without any parameters and it will show some help.

Furtermore: a file called `README-DEVTOOL.md` is installed in your project's root folder after running one of the setup scripts.


### Learn GIT

Git is an important tool for developers. It is integrated in the devtool. To learn more about working with git:

@see [Git tips and tricks](https://github.com/HKdigital/hkdigital-jsdevtool/tree/main/doc/readme/git-tips-and-tricks.md)


### Install libraries

To speed up the development of your application, we recommend to use libraries.
You can create your own libraries, so you can reuse code in multiple projects or you can use the libraries published by HKdigital or both. The publishing of the HKdigital libraries is work in progress, but brave men or woman can already use them.

#### HKdigital's base library

Libraries may depend on eachother (use code from another library). The is one base library that most other libraries need [Base Library](https://github.com/HKdigital/jslib--hkd-base).

This library can be used in both SVELTE and NodeJS projects and contains code constructs that can be used to create a nice application basis.

#### HKdigital's frontend libraries

Frontend library for SVELTE projects
[Frontend Library](https://github.com/HKdigital/jslib--hkd-fe)

More specific frontend libraries will follow.

#### HKdigital's backend libraries

**The backend library is undergoing heavy changes and has therefore not been published yet, 
   please contact us if you're interested**

Backend library for NodeJS projects **(private)**
[Backend Library](https://github.com/HKdigital/jslib--hkd-be)

More specific backend libraries will follow.

