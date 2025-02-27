import { makeRequestFunctionType } from "../rest_api"
import { integer, ApiResponse_AuthLoginPost, ApiResponse_AuthLoginwithtokenPost, ApiResponse_AuthCheckGet, ApiResponse_AuthRegisterPost, ApiResponse_AuthStreamtokenGet, ApiResponse_UserGet, ApiResponse_UserPatch, ApiResponse_UserSelfGet, ApiResponse_FileGet, ApiResponse_WorkspaceMyworkspacesGet, ApiResponse_WorkspacePost, ApiResponse_WorkspaceGet, ApiResponse_WorkspacePatch, ApiResponse_WorkspaceFilePost, ApiResponse_WorkspaceFilesGet, ApiResponse_WorkspaceConnectionsGet, ApiResponse_WorkspaceConnectionsPost, ApiResponse_ConnectionGet, ApiResponse_RemotecontrollerGet, ApiResponse_RemotecontrollerLastpositionGet, ApiResponse_DroneGet, ApiResponse_DroneLastpositionGet, ApiResponse_DroneLastbatteryGet, ApiResponse_DroneMediaGet, ApiResponse_ConnectionlinkConfigGet, ApiResponse_ConnectionlinkDjipilot2SdkconfigGet } from './rest_api_types'

export function makeStructure(makeRequest: makeRequestFunctionType) {
    return {
        API_VERSION: '0.3.0'
        ,
        auth: {
            login: {
                post:
                    function(data: { username: string, password: string }) {
                        return makeRequest<ApiResponse_AuthLoginPost>('/auth/login', 'post', false, undefined, data)
                    },
            },
            loginWithToken: {
                post:
                    function(data: { token: string }) {
                        return makeRequest<ApiResponse_AuthLoginwithtokenPost>('/auth/login-with-token', 'post', false, undefined, data)
                    },
            },
            check: {
                get:
                    function() {
                        return makeRequest<ApiResponse_AuthCheckGet>('/auth/check', 'get', false, undefined, undefined)
                    },
            },
            passwordChange: {
                post:
                    function(data: { current_password: string, new_password: string }) {
                        return makeRequest<void>('/auth/password-change', 'post', false, undefined, data)
                    },
            },
            passwordReset: {
                post:
                    function(data: { username: string }) {
                        return makeRequest<void>('/auth/password-reset', 'post', false, undefined, data)
                    },
            },
            passwordSetInitial: {
                post:
                    function(data: { new_password: string }) {
                        return makeRequest<void>('/auth/password-set-initial', 'post', false, undefined, data)
                    },
            },
            passwordSetNew: {
                post:
                    function(data: { new_password: string, code: string }) {
                        return makeRequest<void>('/auth/password-set-new', 'post', false, undefined, data)
                    },
            },
            register: {
                post:
                    /**
                    * @deprecated
                    */
                    function(data: { email: string, password?: string }) {
                        return makeRequest<ApiResponse_AuthRegisterPost>('/auth/register', 'post', false, undefined, data)
                    },
            },
            logout: {
                post:
                    function() {
                        return makeRequest<void>('/auth/logout', 'post', false, undefined, undefined)
                    },
            },
            streamToken: {
                get:
                    function() {
                        return makeRequest<ApiResponse_AuthStreamtokenGet>('/auth/stream-token', 'get', false, undefined, undefined)
                    },
            },
        },
        user: {
            get:
                function(params: { userId: number }) {
                    return makeRequest<ApiResponse_UserGet>('/user/{userId}', 'get', false, params, undefined)
                },
            patch:
                function(params: { userId: number }, data: { name?: string, email?: string, locale?: string }) {
                    return makeRequest<ApiResponse_UserPatch>('/user/{userId}', 'patch', false, params, data)
                },
            self: {
                get:
                    function() {
                        return makeRequest<ApiResponse_UserSelfGet>('/user/self', 'get', false, undefined, undefined)
                    },
            },
        },
        file: {
            get:
                function(params: { fileId: number }) {
                    return makeRequest<ApiResponse_FileGet>('/file/{fileId}', 'get', false, params, undefined)
                },
        },
        workspace: {
            myWorkspaces: {
                get:
                    function() {
                        return makeRequest<ApiResponse_WorkspaceMyworkspacesGet>('/workspace/my-workspaces', 'get', false, undefined, undefined)
                    },
            },
            post:
                function(data: { name: string }) {
                    return makeRequest<ApiResponse_WorkspacePost>('/workspace', 'post', false, undefined, data)
                },
            get:
                function(params: { workspaceId: number }) {
                    return makeRequest<ApiResponse_WorkspaceGet>('/workspace/{workspaceId}', 'get', false, params, undefined)
                },
            patch:
                function(params: { workspaceId: number }, data: { name?: string }) {
                    return makeRequest<ApiResponse_WorkspacePatch>('/workspace/{workspaceId}', 'patch', false, params, data)
                },
            delete:
                function(params: { workspaceId: number }) {
                    return makeRequest<void>('/workspace/{workspaceId}', 'delete', false, params, undefined)
                },
            file: {
                post:
                    function(params: { workspaceId: number }, data: { file: File, filename: string }) {
                        return makeRequest<ApiResponse_WorkspaceFilePost>('/workspace/{workspaceId}/file', 'post', true, params, data)
                    },
                patch:
                    function(params: { workspaceId: number, fileId: number }, data: { filename?: string }) {
                        return makeRequest<void>('/workspace/{workspaceId}/file/{fileId}', 'patch', false, params, data)
                    },
                delete:
                    function(params: { workspaceId: number, fileId: number }) {
                        return makeRequest<void>('/workspace/{workspaceId}/file/{fileId}', 'delete', false, params, undefined)
                    },
            },
            files: {
                get:
                    function(params: { workspaceId: number }) {
                        return makeRequest<ApiResponse_WorkspaceFilesGet>('/workspace/{workspaceId}/files', 'get', false, params, undefined)
                    },
            },
            connections: {
                get:
                    function(params: { workspaceId: number }) {
                        return makeRequest<ApiResponse_WorkspaceConnectionsGet>('/workspace/{workspaceId}/connections', 'get', false, params, undefined)
                    },
                post:
                    function(params: { workspaceId: number }, data: { name: string }) {
                        return makeRequest<ApiResponse_WorkspaceConnectionsPost>('/workspace/{workspaceId}/connections', 'post', false, params, data)
                    },
            },
        },
        connection: {
            get:
                function(params: { connectionId: number }) {
                    return makeRequest<ApiResponse_ConnectionGet>('/connection/{connectionId}', 'get', false, params, undefined)
                },
            delete:
                function(params: { connectionId: number }) {
                    return makeRequest<void>('/connection/{connectionId}', 'delete', false, params, undefined)
                },
        },
        remoteController: {
            get:
                function(params: { remoteControllerId: number }) {
                    return makeRequest<ApiResponse_RemotecontrollerGet>('/remote-controller/{remoteControllerId}', 'get', false, params, undefined)
                },
            lastPosition: {
                get:
                    function(params: { remoteControllerId: number }) {
                        return makeRequest<ApiResponse_RemotecontrollerLastpositionGet>('/remote-controller/{remoteControllerId}/last-position', 'get', false, params, undefined)
                    },
            },
        },
        drone: {
            get:
                function(params: { droneId: number }) {
                    return makeRequest<ApiResponse_DroneGet>('/drone/{droneId}', 'get', false, params, undefined)
                },
            lastPosition: {
                get:
                    function(params: { droneId: number }) {
                        return makeRequest<ApiResponse_DroneLastpositionGet>('/drone/{droneId}/last-position', 'get', false, params, undefined)
                    },
            },
            lastBattery: {
                get:
                    function(params: { droneId: number }) {
                        return makeRequest<ApiResponse_DroneLastbatteryGet>('/drone/{droneId}/last-battery', 'get', false, params, undefined)
                    },
            },
            media: {
                get:
                    function(params: { droneId: number }) {
                        return makeRequest<ApiResponse_DroneMediaGet>('/drone/{droneId}/media', 'get', false, params, undefined)
                    },
            },
        },
        connectionLink: {
            auth: {
                check: {
                    get:
                        function() {
                            return makeRequest<void>('/connection-link/auth/check', 'get', false, undefined, undefined)
                        },
                },
                login: {
                    post:
                        function(data: { connection_id: string, secret: string }) {
                            return makeRequest<void>('/connection-link/auth/login', 'post', false, undefined, data)
                        },
                },
            },
            config: {
                get:
                    function() {
                        return makeRequest<ApiResponse_ConnectionlinkConfigGet>('/connection-link/config', 'get', false, undefined, undefined)
                    },
            },
            resetWorkspaceUuid: {
                post:
                    function() {
                        return makeRequest<void>('/connection-link/reset-workspace-uuid', 'post', false, undefined, undefined)
                    },
            },
            djiPilot2: {
                sdkConfig: {
                    get:
                        function() {
                            return makeRequest<ApiResponse_ConnectionlinkDjipilot2SdkconfigGet>('/connection-link/dji-pilot-2/sdk-config', 'get', false, undefined, undefined)
                        },
                },
            },
        },
    }
}
