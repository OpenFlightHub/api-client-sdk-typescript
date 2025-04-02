import { makeStructure } from './generated/rest_api_structure'
import { method } from './generated/rest_api_types'

let apiBaseUrl = ''

function RestApi(baseURL?: string){

    if(!baseURL){
        baseURL = document.location.hostname === 'localhost' ? 'http://localhost:6001' : (document.location.protocol + '//' + document.location.hostname + '/api')
    }

    if(!baseURL.endsWith('/')){
        baseURL += '/'
    }

    apiBaseUrl = baseURL

    return makeStructure(makeRequest)

}

export default RestApi


const REST_API_TIMEOUT = 1000 * 10

let apiAuth: String

export type makeRequestFunctionType = typeof makeRequest

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

        }, REST_API_TIMEOUT)

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
