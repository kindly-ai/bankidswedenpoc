import http from 'http';
import type {AddressInfo} from 'net';
import app from '../src/app'

const PORT = process.env.PORT || '3000';
app.set('port', PORT);


const server = http.createServer(app);
server.listen(PORT, () => {
    const addr = server.address() as AddressInfo;
    console.log(`Listening on http://localhost:${addr.port}`);
});
