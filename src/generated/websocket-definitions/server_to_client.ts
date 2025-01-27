
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

export type Message_Type_Event_Type = 'db_row_update' | 'drone' | 'traffic'

export type Message_Type_Event_Object<T extends Message_Type_Event_Type> = {
    event: T
    filter: string
    eventData: Message_Type_Event_Object_Data<T>
}

//TODO this result into an OR and not a fixed typing...
export type Message_Type_Event_Object_Data<T extends Message_Type_Event_Type> = T extends 'drone' ? Message_Type_Event_Object_Data_Drone : T extends 'db_row_update' ? Message_Type_Event_Object_Data_DbRowUpdate : T extends 'traffic' ? Message_Type_Event_Object_Data_Traffic : unknown

export type Message_Type_Event_Object_Data_Drone = {
    id: number
    position: {
        latitude: number
        longitude: number
        height: number
        reported_at: string
    }
}

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
