// required mapping for non vanilla javascript types
export type method = 'get' | 'post' | 'patch' | 'delete'

export type integer = number

export type ApiResponse_AuthLoginPost = { id: number }

export type ApiResponse_AuthLoginWithTokenPost = { id: number }

export type ApiResponse_AuthCheckGet = { id: number }

export type ApiResponse_AuthRegisterPost = { id: number }

export type ApiResponse_AuthStreamTokenGet = { token: string }

export type ApiResponse_UserGet = { id: number, name: string }

export type ApiResponse_UserPatch = { id: number, name: string, email: string, created_at: string, locale: string, registration_incomplete: boolean }

export type ApiResponse_UserSelfGet = { id: number, name: string, email: string, created_at: string, locale: string, registration_incomplete: boolean }

export type ApiResponse_FileGet = { id: number, name: string, created_at: string, has_thumbnail: boolean }

export type ApiResponse_FileGetMultiplePost = { id: number, name: string, created_at: string, has_thumbnail: boolean }[]

export type ApiResponse_WorkspaceMyWorkspacesGet = { id: number, name: string, longitude: number, latitude: number }[]

export type ApiResponse_WorkspacePost = { id: number }

export type ApiResponse_WorkspaceGet = { id: number, name: string, longitude: number, latitude: number }

export type ApiResponse_WorkspacePatch = { id: number, name: string, longitude: number, latitude: number }

export type ApiResponse_WorkspaceFilePost = { id: number }

export type ApiResponse_WorkspaceFilesGet = { id: number, name: string, created_at: string, has_thumbnail: boolean }[]

export type ApiResponse_WorkspaceConnectionsGet = { id: number, name: string, remote_controller_id?: number, drone_id?: number }[]

export type ApiResponse_WorkspaceConnectionsPost = { connection_id: string, secret: string }

export type ApiResponse_ConnectionGet = { id: number, name: string, remote_controller_id?: number, drone_id?: number }

export type ApiResponse_WorkspaceGeoObjectsGet = (({ id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 0, config: { point: number[], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 1, config: { line: number[][], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 2, config: { polygon: number[][], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 3, config: { center: number[], radius: number, color: string } }) | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 1, sub_type: number, config: { longitude: number, latitude: number, height: number, heading?: number, speed?: number } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 2, sub_type: number, config: { longitude: number, latitude: number, symbol: string, height?: number, heading?: number, speed?: number } })[]

export type ApiResponse_WorkspaceGeoObjectsCreatePost = { id: number }

export type ApiResponse_WorkspaceGeoObjectPatch = (({ id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 0, config: { point: number[], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 1, config: { line: number[][], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 2, config: { polygon: number[][], color: string } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 0, sub_type: 3, config: { center: number[], radius: number, color: string } }) | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 1, sub_type: number, config: { longitude: number, latitude: number, height: number, heading?: number, speed?: number } } | { id: number, uuid: string, workspace_id: number, name: string, created_at: string, updated_at: string, type: 2, sub_type: number, config: { longitude: number, latitude: number, symbol: string, height?: number, heading?: number, speed?: number } })

export type ApiResponse_RemoteControllerGet = { id: number, serial_number: string, type: integer }

export type ApiResponse_RemoteControllerLastPositionGet = { longitude: number, latitude: number, height: number, reported_at: string }

export type ApiResponse_DroneGet = { id: number, serial_number: string, type: integer, name: string, last_connection_id?: number }

export type ApiResponse_DroneLastPositionGet = { longitude: number, latitude: number, height: number, reported_at: string }

export type ApiResponse_DroneLastBatteryGet = { capacity_percent_left: number, reported_at: string }

export type ApiResponse_DroneMediaGet = { id: number, drone_id: number, flight_id: number, type: number, file_id: number, file_name: string, received_at: string, meta?: string, captured_at?: string, camera_location?: { position?: { longitude: number, latitude: number }, height?: number }, camera_angles?: { heading?: number, pitch?: number, roll?: number } }[]

export type ApiResponse_DroneFlightsGet = { id: number, drone_id: number, started_at: string, landed_at?: string, ended_at?: string, track: { height: number, longitude: number, latitude: number, time?: string }[] }[]

export type ApiResponse_DroneCurrentFlightGet = { id: number, drone_id: number, started_at: string, landed_at?: string, ended_at?: string, track: { height: number, longitude: number, latitude: number, time?: string }[] }

export type ApiResponse_FlightGet = { id: number, drone_id: number, started_at: string, landed_at?: string, ended_at?: string, track: { height: number, longitude: number, latitude: number, time?: string }[] }

export type ApiResponse_FlightMediaGet = { id: number, drone_id: number, flight_id: number, type: number, file_id: number, file_name: string, received_at: string, meta?: string, captured_at?: string, camera_location?: { position?: { longitude: number, latitude: number }, height?: number }, camera_angles?: { heading?: number, pitch?: number, roll?: number } }[]

export type ApiResponse_MediaGet = { id: number, drone_id: number, flight_id: number, type: number, file_id: number, file_name: string, received_at: string, meta?: string, captured_at?: string, camera_location?: { position?: { longitude: number, latitude: number }, height?: number }, camera_angles?: { heading?: number, pitch?: number, roll?: number } }

export type ApiResponse_MediaGroundCoverageGet = { coverage: { all: { position: { longitude: number, latitude: number }, elevation: number, debug?: string, ray?: { bearing: number, pitch: number, imagePosition: { x: number, y: number } }, directDistance?: number, meterSize?: { vertical: number, horizontal: number } }[], outer: { position: { longitude: number, latitude: number }, elevation: number, debug?: string, ray?: { bearing: number, pitch: number, imagePosition: { x: number, y: number } }, directDistance?: number, meterSize?: { vertical: number, horizontal: number } }[], holes: { position: { longitude: number, latitude: number }, elevation: number, debug?: string, ray?: { bearing: number, pitch: number, imagePosition: { x: number, y: number } }, directDistance?: number, meterSize?: { vertical: number, horizontal: number } }[][] } }

export type ApiResponse_ConnectionLinkConfigGet = { connection_id: string, platform_name: string, platform_url: string, workspace_id: string, workspace_uuid: string, workspace_name: string, secret: string }

export type ApiResponse_ConnectionLinkDjiPilot2SdkConfigGet = { app_id: string, app_key: string, app_license: string, mqtt_url: string, rtmp_url: string, api_url: string, ws_url: string }

