
# How to generate the sdk

* check out `api` repo in the same folder as this repository
* open the `dev` folder in VSCode
* run `npm install` in the `dev` folder

### Option A: VSCode
* hit `F5`

### Option B: command line
* run `bash build.sh && node build/generate.js`

### Updating versions
If you publish a new version, make sure to update the contents of `client_sdk.version`
The api version is automatically fetched from the openapi spec file in the api repository

* generate sdk
