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




