const fs = require('fs');
const ws = require('ws');

class Game {
    rooms = {
        tn18r7b: {
            admin: 'Muie',
            players: [],
            started: false,
            adminJoined: false,
        },
    };

    constructor() {
        this.questions = JSON.parse(
            fs.readFileSync('src/backend/game/questions.json', 'utf8')
        );
    }

    setupWS = (wsServer) => {
        wsServer.on('connection', (socket) => {
            socket.on('message', (data) => {
                console.log(data);
            });
        });
    };

    setupRoutes = (expressApp) => {
        expressApp.post('/createRoom', (req, res) => {
            const { username } = req.body;
            if (!username) {
                res.status(400);
                res.end();
                return;
            }

            const roomName = Math.random().toString(36).substr(2, 7);
            this.rooms[roomName] = {
                admin: username,
                players: [],
                started: false,
            };

            res.send({ room: roomName });
            res.status(200);
            res.end();
        });

        expressApp.get('/room/available/:roomName/:username', (req, res) => {
            const room = this.rooms[req.params.roomName];
            const available = !!room && room.started === false;
            const usernameAvailable =
                !!room &&
                !room.players.includes(req.params.username) &&
                room.admin !== req.params.username;
            res.send({ available, usernameAvailable });
            res.end();
        });

        expressApp.get('/rooms', (req, res) => {
            res.send(this.rooms);
            res.end();
        });
    };
}

module.exports = Game;
