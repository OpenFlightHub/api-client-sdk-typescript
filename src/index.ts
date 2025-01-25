
import LiveWebsocket, { LiveWebsocketType } from "./live_websocket"
import RestApi from "./rest_api"
import EventManager from "./util/event_manager"

export default function OpenFlightHubApi(options?: {
    restApiBaseUrl?: string
    liveWebsocketBaseUrl?: string
}){


    const liveWebsocket = LiveWebsocket(options?.liveWebsocketBaseUrl)

    return {
        rest: RestApi(options?.restApiBaseUrl),
        live: liveWebsocket,
        apiStatus: new ApiStatus(liveWebsocket)
    }
}



export interface ApiStatusEvents {
    connected: undefined
    disconnected: 'logout' | 'tcp_reset' | null
}

class ApiStatus extends EventManager<ApiStatusEvents> {

    private waitForInit : any

    constructor(liveWebsocket: LiveWebsocketType){
        super()

        this.waitForInit = setInterval(()=>{

            const liveUpdateSocket = liveWebsocket.getLiveUpdateSocket()

            if(liveUpdateSocket){
                clearInterval(this.waitForInit)

                liveUpdateSocket.addListener('open', ()=>{
                    this.dispatch('connected', undefined)
                })

                liveUpdateSocket.addListener('reconnected', ()=>{
                    this.dispatch('connected', undefined)
                })

                liveUpdateSocket.addListener('lost', data=>{
                    this.dispatch('disconnected', data.code === 4000 && data.reason === 'logout' ? 'logout' : (data.code === 1006 ? 'tcp_reset' : null ))
                })

                if(liveUpdateSocket.isOpen()){
                    this.dispatch('connected', undefined)
                }
            }
        }, 10)
    }
}
