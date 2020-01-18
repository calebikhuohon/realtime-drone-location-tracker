# realtime-drone-location-tracker
---

This project provides an easy-to-use interface for a fleet of drones, parses and renders the data gotten back in a responsive table.

### Assumptions
---
1. Drones make cellular communication over UDP.
2. The drone's data is sent as an object in a UDP datagram.
3. Data from the drone is in the form `speed:10;location:51.507351,-0.127758;`.
4. The drone receives a `location` command and understands the command requires the above data to be sent.
5. The drone 
---
### Methods and Options

```
const {connect} = require('/backend/index.js');

const drone = connect({
  host: '',               //manually set the host
  port: '40002',          //Set the port
  locationPort: '40003'   //set the location port
  skipOk: false           //skip the OK message
});

// send a command to the drone to get location
// This would not be necessary as command is automatically sent to the 
// drone at intervals which ensure data is returned in real-time
drone.send('location');

// attach a callback to a specific event
drone.on(event, callback);

