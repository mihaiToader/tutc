const express = require('express');
const ws = require('ws');
const bodyParser = require('body-parser');
const path = require('path');

const Game = require('./game/game');

const app = express();
const port = process.env.PORT || 3000;

const BUILD = path.join(__dirname, '../../build/');
const pathToBuild = (filename) => path.join(BUILD, filename);

app.get('/', (req, res) => {
    res.sendFile(pathToBuild('index.html'));
});

app.use('/bundle.js', express.static(pathToBuild('bundle.js')));
app.use('/bundle.css', express.static(pathToBuild('bundle.css')));
app.use('/assets', express.static(pathToBuild('assets')));

app.use(bodyParser.json());

const wsServer = new ws.Server({ noServer: true });

const game = new Game();
game.setupWS(wsServer);
game.setupRoutes(app);

const expressServer = app.listen(port, () => {
    console.log(`App started!`);
});

// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
expressServer.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, (socket) => {
        wsServer.emit('connection', socket, request);
    });
});
