# HKdigital backend

## Usage

### Setup

Update package.json from the project to contain all dependencies of the included libs and run npm install.

```bash
./update-package.json.js
npm install
```

### npm run dev

Runs the backend server in the development mode.

- The server will restart when you make edits
- Lint errors will be shown in the console
- The project will be generated in the `generated/` folder

### npm run test

Launches a test runner that runs unit tests.

### npm run build

Builds the project in the `build/` folder. The root `package.json` of the project will be copied into that folder too. Run `npm install` to create a node_modules folder with the necessary dependencies.

Make sure that the `package.json` in the project folder is up to date and includes all dependencies of the include libs. (run `./update-package.json.js`).

### npm run preview

Start the backend server from the build folder.