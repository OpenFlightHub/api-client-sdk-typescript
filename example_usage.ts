import OpenFlightHubApi from "./dist"

const api = OpenFlightHubApi()

api.apiStatus.addListener('connected', ()=>{
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