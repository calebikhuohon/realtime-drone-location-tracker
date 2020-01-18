import dgram from 'dgram';
import assert from 'assert';
import uuidv4 from 'uuid/v4';
import EventEmitter from 'events';

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
    this.events = new EventEmitter();

    this.droneIO.bind(this.MAIN_PORT);
    this.droneLocation.bind(this.LOCATION_PORT);

    this.droneLocation.on('message', locationBuffer => {
      const parsedLocation = parseDroneLocation(locationBuffer);
      parsedLocation.droneId = uuidv4().split('-').join('');

      this.io.emit('parsedLocation', parsedLocation);
    });

    this.droneIO.on('message', (location) => {
      location = Buffer.isBuffer(location) ? location.toString() : location;

      if (location !== 'ok') {
                
        return this.events.emit('message', location);
      }

      this.events.emit('_ok');

      if (!this.connected) {
        this.connected = true;
        this.events.emit('connection');
      }

      if (!skipOk) return this.emit('message', location);
    });

    
    //minor delay so events can be attached first
    setTimeout(this.send.bind(this, 'location'));

    /** 
     * request drone location every 50ms
     */
    setInterval(() => {
      this.send.bind(this, 'location');
    },50);
  }

  /**
     * send a command to get the drone's data via UDP 
     * @param {"location"} command
     */

  send(command) {
    const error = assert.notStrictEqual(typeof command, 'string');

    return new Promise((resolve, reject) => {
      if (error) return reject(error);

      this.droneIO.send(command, 0, command.length, this.MAIN_PORT, this.HOST, this.events.emit.bind(this.events, 'send'));

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
    this.events.on(event, callback);
  }
}

export default Drone;

