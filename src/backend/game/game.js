const fs = require('fs');
const ws = require('ws');

class Game {
    rooms = {};

    clients = {};

    constructor() {
        this.questions = JSON.parse(
            fs.readFileSync('src/backend/game/questions.json', 'utf8')
        );
    }

    getRoom = (roomName) => this.rooms[roomName];

    sendMessage = (data, socket) => {
        socket.send(JSON.stringify(data));
    };

    sendPlayerList = (room) => {
        room.players.forEach((player) => {
            this.sendMessage(
                {
                    event: 'update-player-list',
                    data: {
                        players: room.players.map(
                            ({ username, correctAnswers }) => ({
                                username,
                                correctAnswers,
                            })
                        ),
                    },
                },
                player.socket
            );
        });
    };

    onUserJoined = (socket, data) => {
        const room = this.getRoom(data.room);
        room.players.push({
            username: data.username,
            id: socket.id,
            socket: socket,
            correctAnswers: 0,
        });
        if (data.username === room.admin.username) {
            room.admin.id = socket.id;
        }
        this.clients[socket.id] = data.room;
        this.sendPlayerList(room);
    };

    onUserDisconnected = (userID) => {
        const roomName = this.clients[userID];
        const room = this.rooms[roomName];
        if (!room) {
            return;
        }

        if (userID === room.admin.id) {
            room.players
                .filter((player) => player.id !== userID)
                .forEach((player) => {
                    this.sendMessage(
                        {
                            event: 'admin-left',
                        },
                        player.socket
                    );
                });
            delete this.rooms[roomName];
            return;
        }

        room.players = room.players.filter((player) => player.id !== userID);
        this.sendPlayerList(room);
    };

    setupWS = (wsServer) => {
        const generateClientID = () => Math.random().toString(36).substr(2, 10);

        wsServer.on('connection', (socket) => {
            socket.id = generateClientID();

            socket.on('message', (messageData) => {
                const message = JSON.parse(messageData);
                const { event, data } = message;
                if (event === 'user-joined') {
                    this.onUserJoined(socket, data);
                } else if (event === 'user-left') {
                    this.onUserDisconnected(socket.id);
                }
            });

            socket.on('close', () => {
                this.onUserDisconnected(socket.id);
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
                admin: {
                    username,
                    id: '',
                },
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
                room.admin.username !== req.params.username;
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
