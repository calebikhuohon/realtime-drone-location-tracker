// import socketIO from 'socket.io';
// import dgram from 'dgram';

// const io = socketIO(https);

// const PORT = 8889;
// const drone = dgram.createSocket('udp4');
// drone.bind(PORT);

// drone.on('message', message => {
//     console.log(message);
//     io.sockets.emit('status', message.toString());
// });

// drone.send('location', PORT);

import express from 'express';

class App {
    constructor() {
        this.express = express();
        this.handleUncaughtErrorEvents();
    }

    handleUncaughtErrorEvents() {
        process.on('unhandledRejection', (reason) => {
            throw reason;
        });

        process.on('uncaughtException', error => {
            console.log(`uncaught exception: ${500} - ${error.message}, stack: ${error.stack}`);
            process.exit(1);
        });

        process.on('SIGINT', () => {
            console.log('goodbye');
            process.exit();
        });
    }

}

const app = new App().express;
export default app;




