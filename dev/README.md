# Protocol Documentation

see [LIVE_WEBSOCKET.md](LIVE_WEBSOCKET.md)

# How to generate the sdk

## Preparations
* check out `api` repo in the same folder as this repository
* open the `dev` folder in VSCode
* run `npm install` in the `dev` folder

## Updating versions
If you publish a new version, make sure to update the contents of `client_sdk.version`
The api version is automatically fetched from the openapi spec file in the api repository

## Generate source code from api specs

### Option A: VSCode
* hit `F5`

### Option B: command line
* run (in the `dev` folder) `bash build.sh && node build/generate.js`

## Run Tests

* in the main repo (not the `dev` folder) run: `npm run test`

## Generate distributable js code

* in the main repo (not the `dev` folder) run: `npm run build`

## Github

* edit CHANGELOG.md and add the new version
* commit
* Make sure you pushed git changes to github (so npmjs can cache the latest version of readme etc)
* create a new tag (version number)

## Publish to npm

* Make sure your version in the package.json has been changed
next step requires successfull login via `npm login`
* run `npm publish` (might require `--otp`)
