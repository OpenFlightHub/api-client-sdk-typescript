
import LiveWebsocket from './live_websocket';
import RestApi from './rest_api';
import {CLIENT_SDK_VERSION} from './generated/client_sdk_version'

export type * from './generated/rest_api_types';
export type {ApiStatusEvents} from './live_websocket'
export type {makeStructure} from './generated/rest_api_structure'
export type {LiveWebsocket}

export class OpenFlightHubApi{

    readonly rest: ReturnType<typeof RestApi>
    readonly live: LiveWebsocket
    readonly VERSION = CLIENT_SDK_VERSION

    constructor(options?: {
        restApiBaseUrl?: string
        liveWebsocketBaseUrl?: string
    }){
        this.rest = RestApi(options?.restApiBaseUrl)
        this.live = new LiveWebsocket(options?.liveWebsocketBaseUrl)
    }
}
