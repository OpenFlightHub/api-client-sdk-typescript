
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

export type Message_Type_Event_Type = 'db_row_update' | 'drone' | 'traffic' | 'remote_controller'

export type Message_Type_Event_Object<T extends Message_Type_Event_Type> = {
    event: T
    filter: string
    eventData: Message_Type_Event_Object_Data<T>
}

//TODO this result into an OR and not a fixed typing...
export type Message_Type_Event_Object_Data<T extends Message_Type_Event_Type> = T extends 'remote_controller' ? Message_Type_Event_Object_Data_RemoteController :T extends 'drone' ? Message_Type_Event_Object_Data_Drone : T extends 'db_row_update' ? Message_Type_Event_Object_Data_DbRowUpdate : T extends 'traffic' ? Message_Type_Event_Object_Data_Traffic : unknown

export type Message_Type_Event_Object_Data_RemoteController = Message_Type_Event_Object_Data_RemoteController_Position

export type Message_Type_Event_Object_Data_RemoteController_Position = {
    id: number
    position: {
        latitude: number
        longitude: number
        height: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_RemoteController_FilterType = 'position'

export type Message_Type_Event_Object_Data_Drone = Message_Type_Event_Object_Data_Drone_Position | Message_Type_Event_Object_Data_Drone_Telemetry


export type Message_Type_Event_Object_Data_Drone_Position = {
    id: number
    position: {
        latitude: number
        longitude: number
        height: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_Drone_Telemetry = {
    id: number
    telemetry: {
        battery_percent: number
        reported_at: string
    }
}

export type Message_Type_Event_Object_Data_Drone_FilterType = 'position' | 'telemetry'

export type Message_Type_Event_Object_Data_DbRowUpdate = {
    table: string
    id: string
}

export type Message_Type_Event_Object_Data_Traffic = {
    id: string
    position: {
        latitude: number
        longitude: number
        height?: number
        reported_at: string
    }
}
