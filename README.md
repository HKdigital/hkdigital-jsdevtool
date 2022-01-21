# Devtools-HK

## About

This project contains o.a. scripts that can be used to setup and manage ES projects.

The scripts are intended to work on `linux like` OS'es (including Mac OS).

## Setup: add devtools-hk to a project

### Create a new git project (optional)

Open a terminal and type the following to create a new git project:

```bash
mkdir my-project
cd my-project
git init
```

### Add submodule to folder `devtools-hk`

```bash
git submodule add git@bitbucket.org:hk-digital/devtools-hk.git devtools-hk
git commit
git push
```

### Setup a frontend project (option 1)
Open a terminal and go to the project folder where you just installed `devtools-hk` and run the setup script.

```bash
./devtools-hk/setup.js frontend
```

To run the frontend:

```bash
./launch-frontend
```

### Setup a backend project (option 2)

The backend is the part of the application that may store the application's files, data in a database and may contains business logic of functionality that can better be done on a server.

```bash
./devtools-hk/setup.js backend
```

To run the backend:

```bash
./launch-backend
```

## Next steps

Use the scripts installed by `devtools-hk` to manage your project.

@see `doc/Using devtools scripts.md` 
