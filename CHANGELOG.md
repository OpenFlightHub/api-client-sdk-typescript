# [2.8.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.7.0...2.8.0) (14. Apr 2025)

* add has_thumbail to file
* add helpers for file and thumbnail url


# [2.7.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.6.0...2.7.0) (13. Apr 2025)

* add file_name and drone_id to media object

# [2.6.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.5.0...2.6.0) (13. Apr 2025)

* add media endpoint

# [2.5.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.4.0...2.5.0) (13. Apr 2025)

* add events drone_media and workspace_drones_media


# [2.4.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.3.0...2.4.0) (11. Apr 2025)

* add property name to workspace connection
* change reference system for connections and drones (drones have a last_connection_id property)


# [2.3.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.2.1...2.3.0) (04. Apr 2025)

* add workspace_drone_positions event
* add serial_number property to drone position


# [2.2.1](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.2.0...2.2.1) (02. Apr 2025)

* change rest api timeout
* add ws_url for for dji pilot sdk config

# [2.2.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.1.0...2.2.0) (27. Feb 2025)

* add property workspace_uuid for /connection-link/config response data

# [2.1.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/2.0.0...2.1.0) (27. Feb 2025)

* add /connection-link/reset-workspace-uuid endpoint

# [2.0.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.2.0...2.0.0) (20. Feb 2025)

* revert the live part of the sdk to version 1.2.0 (which removes the changes to the filter system) and implement new braking changes for events. Also marked version 1.3.0 and 1.4.0 as BREAKING (they should have been a major version).

# [1.4.1](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.4.0...1.4.1) (20. Feb 2025)

* fix ts type Message_Type_Event_Object_Data_Drone_Telemetry

# [1.4.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.3.1...1.4.0) (20. Feb 2025)

BREAKING CHANGE
* implement filter separators

# [1.3.1](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.3.0...1.3.1) (20. Feb 2025)

* fix ts type in subscribeToRemoteController()

# [1.3.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.2.0...1.3.0) (20. Feb 2025)

BREAKING CHANGE
* add live remote_controller and drone telemetry and position

# [1.2.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.1.0...1.2.0) (20. Feb 2025)

* add new endpoints for files and media

# [1.1.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.0.2...1.1.0) (27. Jan 2025)

* add traffic event

# [1.0.2](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.0.1...1.0.2) (26. Jan 2025)

* fix client sdk version property
* **BREAKING** implement live api user friendly
* update usage example

# [1.0.1](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/1.0.0...1.0.1) (26. Jan 2025)

* fix this binding in LiveWebsocket.handleMessage()

# [1.0.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/compare/0.1.0...1.0.0) (26. Jan 2025)

* Reimplemented live websocket

# [0.1.0](https://github.com/OpenFlightHub/api-client-sdk-typescript/commit/e62b161864d728eca5580aa7682fe14bbd43ecc8) (26. Jan 2025)

* Initial version
