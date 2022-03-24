import app from './app';

import * as http from 'http';

import { ServerUtil } from '@casai-org/commons';
const server = http.createServer(app);

const port = ServerUtil.normalizePort(8081);

(async () => {
    server.listen(port);
    server.on('error', ServerUtil.onError(server, port));
    server.on('listening', ServerUtil.onListening(server));
})();
