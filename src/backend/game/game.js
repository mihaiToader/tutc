const fs = require('fs');

const shuffleArray = require('./utils').shuffleArray;

class Game {
    rooms = {};

    clients = {};

    constructor() {
        this.questions = JSON.parse(
            fs.readFileSync('src/backend/game/questions.json', 'utf8')
        );
    }

    getRoom = (roomName) => this.rooms[roomName] || {};

    sendMessage = (data, socket) => {
        socket.send(JSON.stringify(data));
    };

    sendPlayerList = (room) => {
        room.players.forEach((player) => {
            this.sendMessage(
                {
                    event: 'update-player-list',
                    data: {
                        players: room.players
                            .map(({ username, score }) => ({
                                username,
                                score,
                            }))
                            .sort((p1, p2) => p2.score - p1.score),
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
            score: 0,
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
            if (room.gameLoop) {
                clearInterval(room.gameLoop);
            }
            delete this.rooms[roomName];
            return;
        }

        room.players = room.players.filter((player) => player.id !== userID);
        this.sendPlayerList(room);
    };

    sendQuestion = (room) => {
        if (room.currentQuestion === null) {
            room.currentQuestion = 0;
        } else {
            room.currentQuestion += 1;
        }

        room.players.forEach((player) => {
            this.sendMessage(
                {
                    event: 'new-question',
                    data: {
                        ...room.questions[room.currentQuestion],
                        sentAt: Date.now(),
                    },
                },
                player.socket
            );
        });
    };

    extractQuestions = (questionsNumber) => {
        const indexesArray = Array.from(Array(this.questions.length).keys());
        shuffleArray(indexesArray);
        return indexesArray
            .slice(0, questionsNumber)
            .map((index) => this.questions[index]);
    };

    resetGame = (room) => {
        room.started = false;
        room.questions = [];
        room.currentQuestion = 0;
        room.players.forEach((player) => (player.score = 0));
        this.sendPlayerList(room);
    };

    sendWinners = (room, winners) => {
        room.players.forEach((player) => {
            this.sendMessage(
                {
                    event: 'game-finished',
                    data: {
                        winners,
                    },
                },
                player.socket
            );
        });
    };

    gameFinished = (room) => {
        let winners = '';
        let maxScore = 0;
        room.players.forEach((player) => {
            if (player.score > maxScore) {
                winners = player.username;
                maxScore = player.score;
            } else if (player.score === maxScore) {
                winners += ', ' + player.username;
            }
        });
        if (maxScore === 0) {
            winners = '';
        }
        this.resetGame(room);
        this.sendWinners(room, winners);
    };

    gameLoop = (room) => {
        if (room.currentQuestion === 9) {
            clearInterval(room.gameLoop);
            room.gameLoop = null;
            this.gameFinished(room);
            return;
        }

        this.sendQuestion(room);
    };

    onGameStart = ({ username, room: roomName }) => {
        const room = this.getRoom(roomName);
        if (!room || (room.admin || {}).username !== username) {
            return;
        }

        room.started = true;
        room.questions = this.extractQuestions(10);
        room.gameLoop = setInterval(this.gameLoop, 15000, room);
        this.sendQuestion(room);
    };

    onAnswerQuestion = ({ score, username, room: roomName, answer }) => {
        const room = this.rooms[roomName];
        const currentQuestion = room.currentQuestion;
        const question = room.questions[currentQuestion];
        let correct = false;

        if (!room || !room.gameLoop) {
            return;
        }

        const player = room.players.find((p) => p.username === username);
        if (question.correctAnswer === answer) {
            correct = true;
            player.score += score;
            this.sendPlayerList(room);
        }

        this.sendMessage(
            {
                event: 'question-result',
                data: {
                    correct,
                    correctAnswer: question.correctAnswer,
                    answer,
                    score: correct ? score : 0,
                },
            },
            player.socket
        );
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
                } else if (event === 'start-game') {
                    this.onGameStart(data);
                } else if (event === 'answer-question') {
                    this.onAnswerQuestion(data);
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
                questions: [],
                currentQuestion: null,
                winner: '',
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
