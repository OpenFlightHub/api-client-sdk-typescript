import OpenFlightHubApi from "./dist/openflighthub-api"

const api = OpenFlightHubApi()

api.status.addListener('connected', ()=>{
    console.log('api is connected')
})

api.status.addListener('disconnected', reason => {

    if(reason === 'logout'){
        console.log('we have been forcefully logged out by the server (probably some other machine has logged in using the same user account')
    }

    console.log('api is disconnected')
})

console.log(api.CLIENT_SDK_VERSION)
