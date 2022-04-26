# How to use hkdigital-jsdevtool

## Usage
Use the script `devtool.mjs` to control you project. The script supports the following commands:

```
install-deps        Merge all [package.json] files from all library folders
                    into the a single [package.json] in the project root and
                    runs [npm install] in the project root folder.

run                 Run in development mode

build               Build a production version in the [dist] folder

preview             Run the production version from the [dist] folder
                    - Build the project first
                    - Development environment variables from the config 
                      folder will be set
...
```

### Examples

```bash
# Install dependencies
node devtool.mjs install-deps

# Launch the backend in development mode
node devtool.mjs run
```

Press `ctrl-c` to stop.