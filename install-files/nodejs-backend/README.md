# How to use hkdigital-devtool

## About
These instructions are only for developing a backend project.

## Usage
Use the script `devtool.mjs` to control you project. The script supports the following commands:

```
install-deps        Merge all [package.json] files from all library folders
                    into the a single [package.json] in the project root and
                    runs [npm install] in the project root folder.

run                 Run in development mode

build               Build a production version in the [dist] folder

run-dist            Run the production version from the [dist] folder
                    - Build the project first
                    - Development environment variables from the config 
                      folder will be set
```

### Examples

```bash
# Install dependencies
./devtool.mjs install-deps

# Launch the backend in development mode
./devtool.mjs run
```

Press `ctrl-c` to stop the backend script.