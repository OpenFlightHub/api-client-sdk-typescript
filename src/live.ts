import LiveWebSocket, { EventCallback } from "./live_websocket"
import * as client_to_server from './generated/websocket-definitions/client_to_server'
import * as server_to_client from './generated/websocket-definitions/server_to_client'
import EventManager from "./util/event_manager"
import { ReconnectingWebSocket } from "./util/reconnecting_websocket"

export default class Live {

    private readonly liveWebSocket: LiveWebSocket
    readonly status: ApiStatus

    constructor(baseUrl?: string){

        this.liveWebSocket = new LiveWebSocket(baseUrl)

        this.status = new ApiStatus(this.liveWebSocket.getSocket())
    }

    subscribeToRemoteController(remoteControllerId: number, callback: (event: 'remote_controller', filter: server_to_client.Message_Type_Event_Object_Data_RemoteController_FilterType, data: server_to_client.Message_Type_Event_Object_Data_Drone)=>void, filter?: server_to_client.Message_Type_Event_Object_Data_RemoteController_FilterType){//TODO implement unsubscribe
        return this.liveWebSocket.subscribeToEvent('remote_controller', '' + remoteControllerId + (filter ? '.' + filter : '') , (evt, _, data)=>{
            callback(evt, filter, data)
        })
    }

    subscribeToDrone(droneId: number, callback: (event: 'drone', filter: server_to_client.Message_Type_Event_Object_Data_Drone_FilterType, data: server_to_client.Message_Type_Event_Object_Data_Drone)=>void, filter?: server_to_client.Message_Type_Event_Object_Data_Drone_FilterType){
        return this.liveWebSocket.subscribeToEvent('drone', '' + droneId + (filter ? '.' + filter : '') , (evt, _, data)=>{
            callback(evt, filter, data)
        })
    }

    subscribeToDbRowUpdate(table: string, rowId: number, callback: (event: 'db_row_update', filter: string, data: server_to_client.Message_Type_Event_Object_Data_DbRowUpdate)=>void){
        return this.liveWebSocket.subscribeToEvent('db_row_update', table + '.' + rowId, callback)
    }


    subscribeToTraffic(latitude: number, longitude: number, radius: number, callback: (event: 'traffic', filter: string, data: server_to_client.Message_Type_Event_Object_Data_Traffic)=>void){
        return this.liveWebSocket.subscribeToEvent('traffic', [latitude, longitude, radius].join('$'), callback)
    }

}



export interface ApiStatusEvents {
    connected: undefined
    disconnected: 'logout' | 'tcp_reset' | null
}

class ApiStatus extends EventManager<ApiStatusEvents> {

    constructor(socket: ReconnectingWebSocket){
        super()

        socket.addListener('open', ()=>{
            this.dispatch('connected', undefined)
        })

        socket.addListener('reconnected', ()=>{
            this.dispatch('connected', undefined)
        })

        socket.addListener('lost', data=>{
            this.dispatch('disconnected', data.code === 4000 && data.reason === 'logout' ? 'logout' : (data.code === 1006 ? 'tcp_reset' : null ))
        })

        if(socket.isOpen()){
            this.dispatch('connected', undefined)
        }
    }
}
