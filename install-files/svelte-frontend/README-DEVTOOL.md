# How to use hkdigital-jsdevtool

## Usage
Use the script `devtool.mjs` installed in your project folder to control your 
project.

### Update project dependencies

It's a good idea to update the project's dependencies first. The following 
command will update your package.json and run `npm install`.

```bash
node devtool.mjs update-deps
```

### Run project in development mode

To run your project in development mode, use the following command.

```bash
node devtool.mjs run
```

Press `ctrl-c` to stop

### There is more...

The devtool script can do much more, run the script without command to display
the available commands.

```bash
node devtool.mjs
```

### Visual Studio Code...

Visual Studio code can use a TypeScript checker to highlight issues or eslint. 

Configuring this without placing configuration at duplicate locations is work in progress...

If you want Visual Studio Code to check using esling, you should install the eslint plugin.

@see https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint