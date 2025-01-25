import { ReconnectingWebSocket } from "./util/reconnecting_websocket"

const liveUpdatelisteners = new Map<string, Map<number, Function[]>>()
const droneListeners = new Map<number, Function[]>()

export type LiveWebsocketType = {
    getLiveUpdateSocket: () => ReconnectingWebSocket
}

export default function LiveWebsocket(baseUrl?: string){
    setupLive(baseUrl)

    //TODO expose a nice developer friendly api

    return {
        getLiveUpdateSocket(){
            return socketLiveUpdate
        }
    } as LiveWebsocketType
}


let socketLiveUpdate: ReconnectingWebSocket
function setupLive(baseUrl?: string) {
    socketLiveUpdate = new ReconnectingWebSocket(
        baseUrl ? baseUrl : (document.location.hostname === 'localhost' ? 'ws://localhost:9001/live' : ('wss://' + document.location.hostname + '/api/live'))
    )

    const setup = () => {

        for (const tableEntry of liveUpdatelisteners) {
            const tableName = tableEntry[0]

            const idEntries = tableEntry[1]

            for (const idEntry of idEntries) {
                const id = idEntry[0]

                registerListen(tableName, id)

            }
        }

        for(const tableEntry of droneListeners){
            const droneId = tableEntry[0]

            registerLiveDrone(droneId)
        }
    }

    socketLiveUpdate.addListener("open", ()=>{
        console.log('live', 'socket open')
        setup()
    })

    socketLiveUpdate.addListener("reconnected", ()=>{
        console.log('live', 'socket reconnected')
        setup()
    })

    socketLiveUpdate.addListener("message", msg => {

        if (typeof msg !== 'string') {
            throw new Error('live: invalid message data type: ' + typeof msg)
        }

        let parsed
        try {
            parsed = JSON.parse(msg)
        } catch (ex) {
            throw new Error('live: failed to parse message: ' + ex)
        }

        switch (parsed.type) {
            case 'notify_change': {

                const changedTable: string = parsed.data.table
                const changedId: number = parseInt(parsed.data.id)

                if (liveUpdatelisteners.has(changedTable) && liveUpdatelisteners.get(changedTable)!.has(changedId)) {
                    for (const cb of liveUpdatelisteners.get(changedTable)!.get(changedId)!) {
                        try {
                            cb(changedTable, changedId)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                } else {
                    console.warn('unexpectedly received a change notification for something we do not listen to', changedTable, changedId)
                }

            } break

            case 'answer': {

                for (let i = 0; i < pendingMessages.length; i++) {
                    const msg = pendingMessages[i]

                    if (msg.messageId === parsed.messageId) {
                        if (parsed.data.success === true) {
                            msg.resolve(parsed.data.data)
                        } else {
                            msg.reject(parsed.data.error)
                        }

                        pendingMessages.splice(i, 1)
                        break
                    }
                }

            } break

            case 'error': {
                console.error('live', 'server reported error', parsed.data)
            } break


            case 'live_drone': {

                const droneId: number = parsed.data.id
                const position: {
                    reported_at: string
                    latitude: number
                    longitude: number
                    height: number
                } = parsed.data.position

                if (droneListeners.has(droneId)){
                    for (const cb of droneListeners.get(droneId)!) {
                        try {
                            cb(droneId, position)
                        } catch (err) {
                            console.error(err)
                        }
                    }
                }

            } break

            default: {
                throw new Error('live: unsupported message type: ' + parsed.type)
            }
        }
    })

    socketLiveUpdate.addListener('lost', () => {
        console.log('live', 'socket lost')
    })
}

const pendingMessages: { messageId: number, resolve: (value: unknown) => void, reject: (reason: any) => void }[] = []

let messageIdCounter = 1

type WebSocketMessageClientType = 'listen' | 'subscribe-live-drone'
function sendToWebSocket(type: WebSocketMessageClientType, data: any) {

    return new Promise((resolve, reject) => {

        const messageId = messageIdCounter++

        socketLiveUpdate.send(JSON.stringify({
            type,
            data,
            messageId
        }))

        pendingMessages.push({
            messageId,
            resolve,
            reject
        })
    })
}

type SupportedListenTables = string

function listenTo(tableName: SupportedListenTables, id: number, changeCallback: (tableName: string, id: number) => void) {
    if (!liveUpdatelisteners.has(tableName)) {
        liveUpdatelisteners.set(tableName, new Map<number, Function[]>())
    }

    if (!liveUpdatelisteners.get(tableName)!.has(id)) {
        liveUpdatelisteners.get(tableName)!.set(id, [])
    }

    liveUpdatelisteners.get(tableName)!.get(id)?.push(changeCallback)

    registerListen(tableName, id)
}

function registerListen(tableName: string, id: number) {
    sendToWebSocket('listen', {
        table: tableName,
        id: id
    }).catch(err => {
        console.error('live', 'failed to listen', err)
    })
}


function listenToLiveDrone(droneId: number, callback: (droneId: number, position: {
    reported_at: string
    latitude: number
    longitude: number
    height: number}
) => void){
    if(!droneListeners.has(droneId)){
        droneListeners.set(droneId, [])
    }

    droneListeners.get(droneId)!.push(callback)

    registerLiveDrone(droneId)
}

async function registerLiveDrone(droneId: number){
    sendToWebSocket('subscribe-live-drone', {
        drone_id: droneId
    })
}


// live session

export function makeLiveSessionSocket(sessionId: number) {
    const socketLiveSession = new ReconnectingWebSocket("wss://" + document.location.host + '/api/live-session/' + sessionId)

    socketLiveSession.addListener("open", () => {
        //console.log('live-session', 'socket open')
    })

    socketLiveSession.addListener('lost', () => {
        //console.log('live-session', 'socket closed')
    })

    return socketLiveSession
}
