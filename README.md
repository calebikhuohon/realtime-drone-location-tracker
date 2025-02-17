# Realtime Drone Location Tracker
---

This project provides an easy-to-use interface for a fleet of drones, parses and renders the data gotten back in a responsive table.

### Assumptions
---
This system makes the following assumptions

1. Drones make cellular communication over UDP.
2. The drone's data is sent as an object in a UDP datagram.
3. The drone speed and drone location (in latitude and longitude) are sent a part of the data received from the drone and this 
   data is in the form `speed:10;location:51.507351,-0.127758;` .
4. The drone receives a `location` command and understands the command requires the above data to be sent.
5. The drone reports its current speed in metres/seconds

---

### Thought Process Through Which the System was Actualized

As described by the problem statement, a fleet of drones are required to communicate their location and current speeds to a dashboard on a web client in real-time through cellular communication.

 Cellular communication channels include TCP and UDP and both provide certain unique features for communication between systems. Since communication speed and low latency were a priority in this case, UDP was chosen as it is faster than TCP and provides low latency since it doesn't require a confirmation from the connected client that a datagram was received.

 A UDP client on the drone receives a request for the drone's location at intervals and sends it to the UDP server which then sends the received message almost immediately to the web client through a web socket connection. Web sockets were used to enable real-time communication between the web client and web server.

 In order to determine if the distance moved by a drone is less than a metre (or if the drone hasn't moved in 10 seconds), the distance between a drone's current and previous coordinates had to be calculated. This calculation was done on the web client since this was were the state of the application was handled. The calculation used the great circle distance method which provides the distance between any two points on the earth's surface. The time spent by the drone is calculated by multiplying the distance moved by the drone against its speed.

In the case where a drone has barely moved within 10 seconds, the drone is highlighted with a blue colour on the web dashboard.

---

### Methods and Options

```js
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

/**
 * All events of the on method
 * connection - Fired when connected to the drone                  callback()
 * parsedLocation - Fired when the drone sends its state message.  callback(locationObject, webSocketConnection)
 * send - Fired when a command is sent.                            callback(error, messageLength)
 * message - Fired when the drone sends a status message           callback(message, udpConnection)
 * /

```
---

### Setup Procedure

#### Production

- Run `docker build .` in a bash terminal to create production build.
- Run `docker run -p 8080:80 <ContainerID>` to map ports between the container and the browser.
- Open `localhost:8080` in the browser.

#### Development

- Run `docker build -f Dockerfile.dev` in a bash terminal to create dev build.
- Run `docker run -p 3001:3000 <ContainerID>` to create port mappings and execute the container.
- Open `localhost:3001` in the browser.

