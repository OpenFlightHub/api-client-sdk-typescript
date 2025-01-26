# Documentation for the websocket protocol

**Note: all the definitions are actually defined in the `api` repository, this client sdk then implements some helper functions for easier usage. This document serves only as a general information!**

## Authentication

The api uses the same authentication like the REST API (cookies). If you call the `/auth/login` endpoint (or similar ones), the required cookie will be set. This cokkie must be transmitted when performing the http upgrade call to `/api/live`.

## General Protocol

The socket talk to each other with strings (not binary). The string MUST be a JSON encoded object. Both `server to client` and `client to server` share this base schema:

```javascript
{
    "type": "string", // "error" or "answer"
    "data": "?", // if "type" === "error" data is a string, otherwise it can be any kind of data (including undefined)
    "messageId": 0 // the sender increments this messageId. Unless he wants to answer to a message, then this is the same id as the id of the message he wants to answer to
}
```

### Client to Server
The client can send following additional messages:

#### Subscribe to event
```javascript
{
    "type": "subscribe",
    "data": {
        "event": "string",
        "filter": "string"
    }
    "messageId": ++messageIdCounter
}
```

Following events are supported

##### `drone`

Subscribe to live positions of a drone

```javascript
{
    "type": "subscribe",
    "data": {
        "event": "drone",
        "filter": "1" // droneId: 1
    }
    "messageId": ++messageIdCounter
}
```

##### `db_row_update`

Subscribe to changes of existing database records.

```javascript
{
    "type": "subscribe",
    "data": {
        "event": "db_row_update",
        "filter": "mytable.1" // table: "mytable", rowId: 1
    }
    "messageId": ++messageIdCounter
}
```
