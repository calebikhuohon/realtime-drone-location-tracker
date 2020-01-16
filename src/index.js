import app from './app';
import webSocket from  './socket';

const port = 4001;

app.set('port', port);
const server = app.listen(app.get('port'), (err) => {
    if(err) {
        console.log(err);
    }

    console.log(`server is listening on port ${port}`);
});

const io = webSocket.init(server);

io.on('connection', socket => {
    console.log('client connected');
});

 