
export type Message<T extends Message_Type> = {
    type: T
    data: Message_Data<T>
    messageId: number
}

export type Message_Type = 'error' | 'answer' | 'event'

export type Message_Data<T extends Message_Type> = T extends 'answer' ? Message_Type_Answer_Data<any> : T extends 'event' ? Message_Type_Event_Object<Message_Type_Event_Type> : T extends 'error' ? string : unknown

export type Message_Type_Answer_Data<R extends any> = {
    success: boolean
    result: R
}

export type Message_Type_Event_Type = 'db_row_update' | 'drone_position' | 'drone_telemetry' | 'traffic' | 'remote_controller_position' | 'workspace_drones_position' | 'drone_media' | 'workspace_drones_media' | 'map_element'

export type Message_Type_Event_Object<T extends Message_Type_Event_Type> = {
    event: T
    filter: string
    eventData: Message_Type_Event_Object_Data<T>
}

//TODO this result into an OR and not a fixed typing...
export type Message_Type_Event_Object_Data<T extends Message_Type_Event_Type> = T extends 'remote_controller_position' ? Message_Type_Event_Object_Data_Remote_Controller_Position : T extends 'drone_position' ? Message_Type_Event_Object_Data_Drone_Position : T extends 'drone_telemetry' ? Message_Type_Event_Object_Data_Drone_Telemetry : T extends 'db_row_update' ? Message_Type_Event_Object_Data_DbRowUpdate : T extends 'traffic' ? Message_Type_Event_Object_Data_Traffic : T extends 'workspace_drones_position' ? Message_Type_Event_Object_Data_Workspace_Drone_Position : T extends 'drone_media' ? Message_Type_Event_Object_Data_Drone_Media : T extends 'workspace_drones_media' ? Message_Type_Event_Object_Data_Workspace_Drone_Media : T extends 'map_element' ? Message_Type_Event_Object_Data_Map_Element : unknown

export type Message_Type_Event_Object_Data_Remote_Controller_Position = {
    id: number
    position: {
        latitude: number
        longitude: number
        height: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_Drone_Position = {
    id: number
    serial_number: string
    position: {
        latitude: number
        longitude: number
        height: number
        reported_at: string
    }
}


export type Message_Type_Event_Object_Data_Workspace_Drone_Position = Message_Type_Event_Object_Data_Drone_Position

export type Message_Type_Event_Object_Data_Drone_Telemetry = {
    id: number
    telemetry: {
        capacity_percent_left: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_DbRowUpdate = {
    table: string
    id: string
}

export type Message_Type_Event_Object_Data_Traffic = {
    id: string
    name: string
    position: {
        latitude: number
        longitude: number
        height?: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_Drone_Media = {
    id: number
    workspace_id: number
    drone_id: number
    flight_id: number
    file_id: number
    drone_serial_number: string
}

export type Message_Type_Event_Object_Data_Workspace_Drone_Media = Message_Type_Event_Object_Data_Drone_Media


export type Message_Type_Event_Object_Data_Map_Element<MapElementEventType = 'create' | 'update' | 'delete'> = {
    event_type: MapElementEventType
    uuid: string
    data: MapElementEventType extends 'delete' ? undefined : (Message_Type_Event_Object_Data_Map_Element_Point | Message_Type_Event_Object_Data_Map_Element_Line | Message_Type_Event_Object_Data_Map_Element_Polygon | Message_Type_Event_Object_Data_Map_Element_Circle)
}

export type Message_Type_Event_Object_Data_Map_Element_Base<T extends number> = {
    id: number
    uuid: string
    name: string
    type: T
    color: string
    created_at: string
    updated_at: string
}

export interface Message_Type_Event_Object_Data_Map_Element_Point extends Message_Type_Event_Object_Data_Map_Element_Base<0> {
    longitude: number
    latitude: number
    elevation?: number
}

export interface Message_Type_Event_Object_Data_Map_Element_Line extends Message_Type_Event_Object_Data_Map_Element_Base<1> {
    coordinates: {
        longitude: number
        latitude: number
        elevation?: number
    }[]
}

export interface Message_Type_Event_Object_Data_Map_Element_Polygon extends Message_Type_Event_Object_Data_Map_Element_Base<2> {
    coordinates: {
        longitude: number
        latitude: number
        elevation?: number
    }[][]
}

export interface Message_Type_Event_Object_Data_Map_Element_Circle extends Message_Type_Event_Object_Data_Map_Element_Base<7> {
    longitude: number
    latitude: number
    radius: number
}
