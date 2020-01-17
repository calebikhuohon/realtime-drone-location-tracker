import dgram from 'dgram';
import assert from 'assert';

import { getIO } from './socket';
import { parseDroneLocation } from './utility';


class Drone {
  constructor({
    host,
    port ,
    locationPort,
    skipOk = false, 
  }) {
    assert.equal(typeof host, 'string');
    assert.equal(typeof port, 'string');
    assert.equal(typeof locationPort, 'string');
    assert.equal(typeof skipOk, 'boolean');

    this.HOST = host;
    this.MAIN_PORT = port;
    this.LOCATION_PORT = locationPort;
    this.droneIO = dgram.createSocket('udp4');
    this.droneLocation = dgram.createSocket('udp4');
    this.connected = false;

    this.io = getIO();

    this.droneIO.bind(this.MAIN_PORT);
    this.droneLocation.bind(this.LOCATION_PORT);

    this.droneLocation.on('message', locationBuffer => {
      const parsedLocation = parseDroneLocation(locationBuffer);
      this.io.emit('parsedLocation', parsedLocation);
    });

    this.droneIO.on('message', (location) => {
      let message = Buffer.isBuffer(location) ? location.toString() : location;

      if (message !== 'ok') {
                
        return this.io.emit('message', message);
      }

      this.io.emit('_ok');

      if (!this.connected) {
        this.connected = true;
        this.io.emit('connection');
      }

      if (!skipOk) return this.io.emit('message', message);
    });

    /**
     * request drone location every 10ms
     */
    setInterval(() => {
      this.send('location');
    }, 10);
  }

  /**
     * send a command to get the drone location via UDP every 5-10ms
     */

  send(command, force) {
    const error = assert.notEqual(command, 'location');

    return new Promise((resolve, reject) => {
      if (error && !force) return reject(error);

      this.droneIO.send(command, 0, this.MAIN_PORT, this.HOST, this.events.emit.bind(this.events, 'send'));

      //return location data immediately
      return resolve();
    });
  }

  /**
     * Attach a callback to a specific event
     * @param {String} event 
     * @param {Function} callback 
     */
  on(event, callback) {
    this.io.on(event, callback);
  }
}

export default Drone;

