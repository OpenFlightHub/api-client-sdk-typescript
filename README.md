# OpenFlightHub API Client SDK
This is a typescript sdk made to talk to the [OpenFlightHUb Api](openflighthub.org/api).

## Features
* typescript typings (for parameters, request bodies and returned data)
* automatically handles idempotency

### Dependencies
* none

## Usage

see [example_usage.ts](example_usage.ts)

## How to generate the sdk
* check out `api` repo in the same folder as this repo
* run `npm install`

### Option A: VSCode
* hit `F5`

### Option B: command line
* run `bash build.sh && node build/generate.js`

### Updating versions
If you publish a new version, make sure to update the contents of `src/api.version` and `src/client_sdk.version`

* generate sdk
* on github [create a new release](https://github.com/api-client-sdk-typescript/releases/new)
* with tag and title `v1.0.0` (or whatever the version number of the client sdk is)
* and upload the file `dist/openflighthub-api.ts`
