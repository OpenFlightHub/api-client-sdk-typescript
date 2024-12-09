

//TODO: validate structure of response, if doesnt match, throw an error, so we dont get weird unexpected stuff in the frontend
/* BEGIN TEMPLATING STUFF */

import * as fs from 'fs'
import * as path from 'path'

import * as handlebars from 'handlebars'
import { execSync } from 'child_process'

export function generate(){
    const start = Date.now()
    handlebars.registerHelper("raw-helper", function(options) {
        return options.fn()
    })

    const templateFiles = fs.readdirSync(path.join(__dirname, './templates'))

    if(templateFiles){
        templateFiles.filter(val => val.startsWith('_')).forEach(val => {
            handlebars.registerPartial(val.substring(1).replace(/\.template/, ''), fs.readFileSync(path.join(__dirname, './templates', val), {
                encoding: 'utf-8'
            }))
        })
    }

    function render(templateName: string, config: object, suffix?: string){
        const templatePath = path.join(__dirname, './templates', templateName + '.template' + (suffix || ''))

        return handlebars.compile(fs.readFileSync(templatePath, {
            encoding: 'utf-8'
        }))(config)
    }

    /* END TEMPLATING STUFF */


    function recursivelyDereferenceOpenApiSpec(ctx: object, glob: object){
        if(ctx instanceof Array){
            return ctx.map(val => recursivelyDereferenceOpenApiSpec(val, glob))
        } else if(ctx instanceof Object){
            if(ctx['$ref']){
                const schema = recursivelyDereferenceOpenApiSpec(getReferencedSchema(glob, ctx['$ref']), glob)
                return schema
            } else {
                const ret = {}

                for(const key of Object.keys(ctx)){
                    ret[key] = recursivelyDereferenceOpenApiSpec(ctx[key], glob)
                }

                return ret
            }

        } else {
            return ctx
        }
    }

    const schemaCache = {}

    function getReferencedSchema(openApiSpec: object, ref: string){

        if(schemaCache[ref]){
            return schemaCache[ref]
        }

        let ctx = openApiSpec

        const split = ref.split('/').filter(val => val !== '#' && val !== '')

        while(split.length > 0){
            const key = split.splice(0, 1)

            ctx = ctx[key[0]]

            if(!ctx){
                throw new Error('$ref not found: "' + ref + '"')
            }

            if(ctx['$ref']){
                ctx = recursivelyDereferenceOpenApiSpec(ctx, openApiSpec)
            }
        }

        schemaCache[ref] = ctx

        return ctx
    }

    if(!fs.existsSync(path.join(__dirname, './log'))){
        fs.mkdirSync(path.join(__dirname, './log'))
    }

    if(!fs.existsSync('../api/openapi_spec.yaml')){
        throw new Error('could not find ../api/openapi_spec.yaml. Did you forget to checkout the "api" repository?')
    }

    const yaml = require('js-yaml')
    const openApiSpec = yaml.load(fs.readFileSync('../api/openapi_spec.yaml', 'utf8'))
    fs.writeFileSync(path.join(__dirname, './log', 'spec_parsed.json'), JSON.stringify(openApiSpec, null, 2))


    const doc = recursivelyDereferenceOpenApiSpec(openApiSpec, openApiSpec)
    fs.writeFileSync(path.join(__dirname, './log', 'spec_dereferenced.json'), JSON.stringify(doc, null, 2))

    const api = {
        properties: [{
            name: 'API_VERSION',
            value: "'" + fs.readFileSync(path.join(__dirname, '..', 'src', 'api.version'), {encoding: 'utf-8'}) + "'"
        },{
            name: 'CLIENT_SDK_VERSION',
            value: "'" + fs.readFileSync(path.join(__dirname, '..', 'src', 'client_sdk.version'), {encoding: 'utf-8'}) + "'"
        },{
            name: 'listenToLiveUpdate',
            value: 'listenTo'
        },{
            name: 'status',
            value: 'apiStatus'
        }]
    }


    const allReturnTypeDefinitions: {name: string, typeString: string}[] = []


    for(const path of Object.keys(doc.paths)){
        const pathObject = doc.paths[path]

        for(const method of Object.keys(pathObject)){

            const pathParts = path.split('/')
            pathParts.push(method)

            const methodObject = pathObject[method]

            console.log('  processing', path, method)

            if(methodObject['x-no-sdk']){
                continue
            }

            if(methodObject.tags instanceof Array === false || methodObject.tags.length !== 1){
                throw new Error('method does not hava a single tag set: ' + path + ': ' + method)
            }


            const functionParams : any[] = []

            if(methodObject.parameters){
                const t = '{' + methodObject.parameters.filter(param => param.in === 'path')
                    .map(param => camelcasify(param.name) + ': ' + schemaToTypescriptType(param.schema)).join(',') + '}'


                functionParams.push({
                    name: 'params',
                    type: t === '{}' ? undefined : t
                })
            }

            let theContentType: string = ''

            if(methodObject.requestBody && methodObject.requestBody.content){

                const paramTypes : any[] = []

                for(const contentType of Object.keys(methodObject.requestBody.content)){

                    theContentType = contentType // TODO support multiple content types?
                    const c = methodObject.requestBody.content[contentType]

                    switch(contentType){
                        case 'application/json':
                        case 'multipart/form-data': {
                            paramTypes.push(c.schema)
                        } break

                        default: {
                            throw new Error('requestBody content type is not supported: "' + contentType + '" ' + path)
                        }
                    }
                }

                functionParams.push({
                    name: 'data',
                    type: schemaToTypescriptType({anyOf: paramTypes})
                })
            }



            let returnTypeName = 'ApiResponse_' + pathParts.filter(p => !p.startsWith('{')).map(p => {
                p = p.replace(/[^\w]/g, '')
                return p.substring(0,1).toUpperCase() + p.substring(1).toLowerCase()
            }).join('')

            if(methodObject.responses['200'].content){
                allReturnTypeDefinitions.push({
                    name: returnTypeName,
                    typeString: schemaToTypescriptType(methodObject.responses['200'].content[Object.keys(methodObject.responses['200'].content)[0]].schema)
                })
            } else {
                returnTypeName = 'void'
            }

            const apiFunction = {
                functionParams: (functionParams.filter(param => param.type !== undefined)).length === 0 ? undefined : functionParams.map(param => param.name + ': ' + param.type).join(', '),
                returnType: returnTypeName,
                requestParams: ['\'' + path.replace(/\{([^\}]+)\}/g, (match, p1) => {
                    return '{' + camelcasify(p1) + '}'
                }) + '\'', '\'' + method.toLowerCase() + '\'', theContentType === 'multipart/form-data' ? true : false].concat(['params', 'data'].map(name => {
                    const fP = functionParams.find(param => param.name === name)
                    return fP && fP.type !== undefined ? name : 'undefined'
                })).join(', '),
                deprecated: methodObject.deprecated
            }

            const pathPartsConverted = pathParts.filter(val => val !== '' && !val.match(/^\{.*\}$/)).map(val => camelcasify(val))

            recursivelySet(api, pathPartsConverted, apiFunction)
        }
    }


    console.info('generating .ts file ...')

    if(!fs.existsSync(path.join(__dirname, '..', 'dist'))){
        fs.mkdirSync(path.join(__dirname, '..', 'dist'))
    }

    const outputFileName = 'openflighthub-api.ts'

    if(fs.existsSync(path.join(__dirname, '..', 'dist', outputFileName))){

        fs.rmSync(path.join(__dirname, '..', 'dist', outputFileName), {
            force: true
        })
    }

    fs.writeFileSync(path.join(__dirname, '..', 'dist', outputFileName), render('sdk', {api, allTypeDefinitions: allReturnTypeDefinitions}, '.ts'))

    console.info('beautifying ...')

    execSync('npx tsfmt -r ' + outputFileName, {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..', 'dist'),
    })

    console.log('done in', Date.now() - start, 'ms')
}

function recursivelySet(ctx, pathParts, func){
    const pathPart = pathParts.splice(0, 1)[0]

    if(!ctx.properties){
        ctx.properties = []
    }

    let index = ctx.properties.findIndex(val => val.name === pathPart)

    if(pathParts.length > 0){

        if(index === -1){
            ctx.properties.push({name: pathPart, obj: {}})
            index = ctx.properties.length - 1
        }

        const newContext = ctx.properties[index].obj

        recursivelySet(newContext, pathParts, func)
    } else {
        if(index !== -1){
            throw new Error('conflicting path: "' + pathPart + '" @ ' + func.requestParams.split(',')[0])
        }

        ctx.properties.push({name: pathPart, func: func})
    }
}

function camelcasify(val){
    const lowerCase = val.toLowerCase()

    const words = lowerCase.replace(/[^a-zA-Z0-9]/g, '_').split('_').filter(val => val !== '')

    const ret = words.map((val, index) => {
        if(index === 0){
            return val
        } else {
            return val.substring(0, 1).toUpperCase() + val.substring(1)
        }
    }).join('')

    if(ret === ''){
        throw new Error('camelcasify failed for "' + val + '"')
    }

    return ret
}

function schemaToTypescriptType(schema: any){

    if(schema['allOf']){//TODO
        let obj = {}

        while(schema['allOf'].length > 0){
            const sc = schema['allOf'].splice(0, 1)[0]
            Object.assign(obj, sc)
        }

        schema = obj
    } else if(schema['oneOf'] || schema['anyOf']){
        const cf = schema['oneOf'] || schema['anyOf']

        return cf.map(val => schemaToTypescriptType(val)).join('|')
    }

    switch(schema.type){
        case 'null':
        case 'boolean':
        case 'number':
        case 'integer':
            return schema.type


        case 'string':
            return schema.format == 'binary' ? 'File' : 'string'

        case 'array': return schemaToTypescriptType(schema.items) + '[]'

        case 'object': return (schema.properties ? ('{' + Object.entries(schema.properties).map(prop => '' + prop[0] + (schema.required && schema.required.includes(prop[0]) ? '' : '?') + ': ' + schemaToTypescriptType(prop[1])).join(',') + '}') : '{}')

        default: {
            if(schema.properties){
                console.warn('missing schema.type, asuming its an object', schema)
                schema.type = 'object'
                return schemaToTypescriptType(schema)
            }

            console.error('schema', schema)
            throw new Error('unsupported schema type: "' + schema.type + '"')
        }
    }
}
