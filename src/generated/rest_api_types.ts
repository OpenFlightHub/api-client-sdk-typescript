// required mapping for non vanilla javascript types
export type method = 'get' | 'post' | 'patch' | 'delete'

export type integer = number

export type ApiResponse_AuthLoginPost = { id: number }

export type ApiResponse_AuthLoginwithtokenPost = { id: number }

export type ApiResponse_AuthCheckGet = { id: number }

export type ApiResponse_AuthRegisterPost = { id: number }

export type ApiResponse_AuthStreamtokenGet = { token: string }

export type ApiResponse_UserGet = { id: number, name: string }

export type ApiResponse_UserPatch = { id: number, name: string, email: string, created_at: string, locale: string, registration_incomplete: boolean }

export type ApiResponse_UserSelfGet = { id: number, name: string, email: string, created_at: string, locale: string, registration_incomplete: boolean }

export type ApiResponse_FileGet = { id: number, name: string, created_at: string }

export type ApiResponse_WorkspaceMyworkspacesGet = { id: number, name: string }[]

export type ApiResponse_WorkspacePost = { id: number }

export type ApiResponse_WorkspaceGet = { id: number, name: string }

export type ApiResponse_WorkspacePatch = { id: number, name: string }

export type ApiResponse_WorkspaceFilePost = { id: number }

export type ApiResponse_WorkspaceFilesGet = { id: number }[]

export type ApiResponse_WorkspaceConnectionsGet = { id: number, remote_controller_id?: number, drone_id?: number }[]

export type ApiResponse_WorkspaceConnectionsPost = { connection_id: string, secret: string }

export type ApiResponse_ConnectionGet = { id: number, remote_controller_id?: number, drone_id?: number }

export type ApiResponse_RemotecontrollerGet = { id: number, serial_number: string, type: integer }

export type ApiResponse_RemotecontrollerLastpositionGet = { longitude: number, latitude: number, height: number, reported_at: string }

export type ApiResponse_DroneGet = { id: number, serial_number: string, type: integer, name: string }

export type ApiResponse_DroneLastpositionGet = { longitude: number, latitude: number, height: number, reported_at: string }

export type ApiResponse_DroneLastbatteryGet = { capacity_percent_left: number, reported_at: string }

export type ApiResponse_DroneMediaGet = { id: number, type: number, file_id: number, created_at: string, meta?: string }[]

export type ApiResponse_ConnectionlinkConfigGet = { connection_id: string, platform_name: string, platform_url: string, workspace_id: string, workspace_name: string, secret: string }

export type ApiResponse_ConnectionlinkDjipilot2SdkconfigGet = { app_id: string, app_key: string, app_license: string, mqtt_url: string, rtmp_url: string, api_url: string }

