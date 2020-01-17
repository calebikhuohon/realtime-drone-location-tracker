import app from './app';
import { init } from './socket';
import Drone from './drone';

const port = 40001;

app.set('port', port);
const server = app.listen(app.get('port'), (err) => {
  if (err) {
    console.log(err);
  }

  console.log(`server is listening on port ${port}`);
});

const io = init(server);

const connect = (config) => {
  return new Drone(config);
};

// eslint-disable-next-line no-unused-vars
io.on('connection', socket => {
  console.log('client connected');
});

export { connect };

