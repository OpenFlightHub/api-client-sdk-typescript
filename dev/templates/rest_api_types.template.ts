// required mapping for non vanilla javascript types
export type integer = number
export type method = 'get' |'post' | 'patch' | 'delete'

{{#each allTypeDefinitions}}
export type {{this.name}} = {{this.typeString}}

{{/each}}
