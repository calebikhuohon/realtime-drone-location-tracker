import app from './app';
import {init} from  './socket';

const port = 40001;

app.set('port', port);
const server = app.listen(app.get('port'), (err) => {
    if(err) {
        console.log(err);
    }

    console.log(`server is listening on port ${port}`);
});

const io = init(server);

io.on('connection', socket => {
    console.log('client connected');
});

 