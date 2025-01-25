
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

## Generate distributable js code

* in the main repo (not the `dev` folder) run: `npm run build`

