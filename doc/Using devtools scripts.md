# Using the devtools scripts

The scripts are added to `package.json` and executables are also placed in the project's root.


## Git scripts

### Script `submodule-add.sh`

Adds a git submodule to the folder that contains all git submodules: `lib`.

`./submodule-add.sh [<git-base-url>] <repository-name>`

### Script `submodules.sh`

Combined controls for all registered submodules.

E.g. requesting the status will return the status of all registered submodules.

`./submodules.sh status`

The `submodules.sh` script accepts the following sub command's:

- `checkout-main-and-pull` - Checkout main branch and pull from server
- `init` - Tell git we use submodules
- `pull` - Pull updates from server
- `push` - Push updates to server
- `status` - Run `git status` in all submodule folders


## NPM scripts

### Run `npm install` for all git submodules

Enters all git submodule folders and runs `npm install` if a `package.json` exists.

- `scripts/npm/npm-install-recursive.sh`
