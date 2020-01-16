import socketIO from 'socket.io';

let io;

const init = httpServer => {
  io = socketIO(httpServer);
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('web socket not initialized');
  }

  return io;
};

export {
  init,
  getIO,
};