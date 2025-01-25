# OpenFlightHub API Client SDK
This is a typescript sdk made to talk to the [OpenFlightHub Api](https://hub.openflighthub.org/api).

## Features
* typescript typings (for parameters, request bodies and returned data)
* automatically handles idempotency

### Dependencies
* none

## Usage

[install via npm](https://www.npmjs.com/package/openflighthub-api-client-sdk):
```
npm i --save openflighthub-api-client-sdk
```


```typescript
import OpenFlightHubApi from "openflighthub-api-client-sdk"

const api = OpenFlightHubApi()

api.apiStatus.addListener('connected', () => {
    console.log('api is connected')
})

api.apiStatus.addListener('disconnected', reason => {

    if(reason === 'logout'){
        console.log('we have been forcefully logged out by the server (probably some other machine has logged in using the same user account')
    }

    console.log('api is disconnected')
})

console.log('API Version', api.rest.API_VERSION)
console.log('Client SDK Version', api.rest.CLIENT_SDK_VERSION)
```

# For Developers

see [dev/README.md](dev/README.md)
