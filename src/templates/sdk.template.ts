let apiBaseUrl = ''

function OpenFlightHubApi(baseURL?: string){

    if(!baseURL){
        baseURL = document.location.hostname === 'localhost' ? 'http://localhost:6001' : (document.location.protocol + '//' + document.location.hostname + '/api')
    }

    if(!baseURL.endsWith('/')){
        baseURL += '/'
    }

    apiBaseUrl = baseURL

    setupLive()

    return {{> object api}}

}

export default OpenFlightHubApi

// required mapping for non vanilla javascript types
type integer = number
type method = 'get' |'post' | 'patch' | 'delete'


{{#each allTypeDefinitions}}
    export type {{this.name}} = {{this.typeString}}
{{/each}}


let apiAuth: String

async function makeRequest<T>(url: string, method: method, isFormData: boolean, params?: object, data?: object): Promise<T> {
    return new Promise((resolve, reject)=>{

        if (url.startsWith('/')) {
            url = url.substring(1)
        }

        const urlWithParams = url.replace(/\{([^\}]+)\}/g, (match, p1) => {
            if (!params) {
                reject('url contains param "' + p1 + '" but no params are defined')
                return ''
            }

            if (typeof params[p1] !== 'string' && typeof params[p1] !== 'number') {
                reject('url contains param "' + p1 + '" but no valid value for this param was provided (string or number)')
                return ''
            }

            return '' + params[p1]
        })

        if (method === 'patch' && data instanceof Object && Object.keys(data).length === 0) {
            reject('you can not perform a patch operation with empty data')
            return ''
        }


        if (isFormData && data instanceof Object) {//convert data object to form data
            const form = new FormData()
            for (const key of Object.keys(data)) {
                if (data[key] === undefined) {
                    continue
                }

                if (data[key] instanceof Array) {
                    for (const entry of data[key]) {
                        form.append(key, entry)
                    }
                } else {
                    form.set(key, data[key])
                }
            }

            data = form
        }

        const headers: {[key: string]: string}= {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }

        if(apiAuth){
            headers.Cookie = 'user-auth=' + apiAuth
        }

        const abortController = new AbortController()

        const request = new Request(apiBaseUrl + urlWithParams, {
            signal: abortController.signal,
            body: data === undefined ? undefined : JSON.stringify(data),
            method,
            cache: 'no-store',
            headers,
            credentials: 'same-origin'
        })

        let fetchIsDone = false

        let rejectedDueToTimeout = false

        setTimeout(()=>{
            if(fetchIsDone){
                return
            }
            rejectedDueToTimeout = true

            abortController.abort('Fatal: timeout when trying to make api call')

            reject('Fatal: timeout when trying to make api call')

        }, 1000 * 3)

        fetch(request).then(response => {
            fetchIsDone = true

            if (response.headers['set-cookie']) {
                const authValue = (response.headers['set-cookie'] as string[])
                    .find(cookie => cookie.includes('user-auth'))
                    ?.match(new RegExp(`^user-auth=(.+?);`))
                    ?.[1]

                if (authValue) {
                    apiAuth = authValue
                    console.info('api is now authenticated:', authValue)
                }
            }

            if (response.ok) {
                if (response.body) {
                    response.text().then(text => {
                        if(text.length === 0){
                            resolve(undefined as T)
                        } else {
                            try {
                                const parsed = JSON.parse(text)
                                resolve(parsed)
                            } catch(err){
                                reject(err)
                            }
                        }

                    }).catch(err => {
                        console.error('error while response.text()', err)
                        reject(err)
                    })
                } else {
                    resolve(undefined as T)
                    return
                }
            } else {
                if (('' + response.status).startsWith('5')) {

                    //the magic word "Fatal" must be at the begining of the error message, to tell the webapp it is a general unrecoverable server error

                    if (response.body) {
                        response.text().then(body => {
                            reject(`Fatal OpenFlightHub API Error @ ${method.toUpperCase()} ${urlWithParams} : ${response.statusText} ${body}`)
                        }).catch(reject)
                    } else {
                        reject(`Fatal OpenFlightHub API Error @ ${method.toUpperCase()} ${urlWithParams} : ${response.statusText}`)
                    }


                } else {
                    reject(`OpenFlightHub API Error @ ${method.toUpperCase()} ${urlWithParams} : ${response.status} ${response.statusText}`)
                }
            }
        }).catch(reason => {
            if(rejectedDueToTimeout){
                return
            } else {
                reject(reason)
            }
        })
    })
}



// util

class EventManager<M extends {[key: string] : any}> {
    private listeners = new Map<String, Function[]>()

    addListener<E extends keyof M>(eventName: E, callback: (data: M[E])=> void){
        if(!this.listeners.has(eventName as string)){
            this.listeners.set(eventName as string, [])
        }

        this.listeners.get(eventName as string)!.push(callback)
    }

    removeListener<E extends keyof M>(eventName: E, callback: (data: M[E])=> void){
        if(this.listeners.has(eventName as string)){
            const list = this.listeners.get(eventName as string)

            const index = list!.findIndex(c => c === callback)

            if(index !== -1){
                list!.splice(index, 1)
            }

        }
    }

    protected dispatch<E extends keyof M>(eventName: E, data: M[E]){
        if(this.listeners.has(eventName as string)){
            const list = this.listeners.get(eventName as string)

            for(const l of list!){
                l(data)
            }

        }
    }
}

interface ReconnectingWebSocketEvents {
    open: undefined
    lost: {code?: number, reason?: string}
    error: string
    message: string
    reconnected: undefined
}

export class ReconnectingWebSocket extends EventManager<ReconnectingWebSocketEvents> {

    private firstOpenEvent = true
    private url: string
    private socket: WebSocket

    private TIMEOUT_BETWEEN_SEND = 200
    private RECONNECT_TIMEOUT = 1000

    private keepAliveInterval

    constructor(url: string) {
        super()

        this.url = url

        this.createSocket()
    }

    private createSocket() {

        this.socket = new WebSocket(this.url)

        setTimeout(()=>{
            if(this.firstOpenEvent && !this.isOpen()){
                console.warn('fatal: connecting to websocket timed out')
                this.socket.close()
            }
        }, 1000 * 3)

        if(this.keepAliveInterval !== undefined){
            clearInterval(this.keepAliveInterval)
        }

        this.keepAliveInterval = setInterval(()=>{
            this.sendKeepAlive()// prevent TCP RST happening (some routers do that if connection is not being used)
        }, 1000 * 5)

        this.socket.addEventListener('open', evt => {
            if (this.firstOpenEvent) {
                this.firstOpenEvent = false

                this.dispatch('open', undefined)
            } else {
                this.dispatch('reconnected', undefined)//TODO due to energy saving, browsers close unused sockets after some time, we should send over some messages from time to time to keep it open (so it does not constantly reconnect)
            }
        })

        this.socket.addEventListener('message', (evt)=>{
            this.dispatch('message', evt.data)
        })

        this.socket.addEventListener('error', evt => {
            this.dispatch('error', typeof evt.toString === 'function' ? evt.toString() : '' + evt)
        })

        this.socket.addEventListener('close', evt => {
            setTimeout(()=>{
                this.createSocket()
            }, this.RECONNECT_TIMEOUT)

            this.dispatch('lost', {code: evt.code, reason: evt.reason})
            //console.log('websocket disconnected', this.url)
        })
    }

    sendKeepAlive(){
        if(this.isOpen()){
            this.socket.send('keep-alive')
        }
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.isOpen()) {
            this.socket.send(data)
        } else {
            setTimeout(() => {
                this.send(data)
            }, this.TIMEOUT_BETWEEN_SEND)
        }
    }

    close() {
        this.socket.close()

        clearInterval(this.keepAliveInterval)
    }

    isOpen(){
        return this.socket.readyState === WebSocket.OPEN
    }

}







// live

const liveUpdatelisteners = new Map<string, Map<number, Function[]>>()
const droneListeners = new Map<number, Function[]>()

let socketLiveUpdate: ReconnectingWebSocket
function setupLive() {
    socketLiveUpdate = new ReconnectingWebSocket(
        document.location.hostname === 'localhost' ? 'ws://localhost:9001/live' : ('wss://' + document.location.hostname + '/api/live')
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



export interface ApiStatusEvents {
    connected: undefined
    disconnected: 'logout' | 'tcp_reset' | null
}

class ApiStatus extends EventManager<ApiStatusEvents> {

    private waitForInit : any

    constructor(){
        super()

        this.waitForInit = setInterval(()=>{
            if(socketLiveUpdate){
                clearInterval(this.waitForInit)

                socketLiveUpdate.addListener('open', ()=>{
                    this.dispatch('connected', undefined)
                })

                socketLiveUpdate.addListener('reconnected', ()=>{
                    this.dispatch('connected', undefined)
                })

                socketLiveUpdate.addListener('lost', data=>{
                    this.dispatch('disconnected', data.code === 4000 && data.reason === 'logout' ? 'logout' : (data.code === 1006 ? 'tcp_reset' : null ))
                })

                if(socketLiveUpdate.isOpen()){
                    this.dispatch('connected', undefined)
                }
            }
        }, 10)
    }
}

const apiStatus = new ApiStatus()
