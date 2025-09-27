const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const players = {};



setInterval(() => { Frame(); }, 16)

playerSpeed = 2;
connectedCount = 0;
runningCount = 0;

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {

    // New connection housekeeping. Running count is used for naming.
    console.log('a user connected');
    connectedCount += 1;
    runningCount += 1;
    console.log('connected users: ' + connectedCount);

    players["player" + runningCount] = { x: Math.random() * 800, y: Math.random() * 600, xDir: 0, yDir: 0, flags: [false, false, false, false], roomName: "" }
    socket.join("room" + runningCount);
    socket.playerName = "player" + runningCount;
    players[socket.playerName].roomName = "room" + runningCount;
    console.log(players);

    socket.emit("Identify", socket.id);




    socket.on('KeyDown', (keyIn, id) => {
        if (id == socket.id) {
            io.to(players[socket.playerName].roomName).emit("KeyEvent", keyIn);
            if (keyIn == "ArrowUp") {
                players[socket.playerName].flags[0] = true;
            } else if (keyIn == "ArrowDown") {
                players[socket.playerName].flags[1] = true;
            } else if (keyIn == "ArrowLeft") {
                players[socket.playerName].flags[2] = true;
            } else if (keyIn == "ArrowRight") {
                players[socket.playerName].flags[3] = true;
            }
        }


    });

    socket.on('KeyUp', (keyIn, id) => {
        if (id == socket.id) {

            if (keyIn == "ArrowUp") {
                players[socket.playerName].flags[0] = false;
            } else if (keyIn == "ArrowDown") {
                players[socket.playerName].flags[1] = false;
            } else if (keyIn == "ArrowLeft") {
                players[socket.playerName].flags[2] = false;
            } else if (keyIn == "ArrowRight") {
                players[socket.playerName].flags[3] = false;
            }
        }
    });


    socket.on('disconnect', () => {
        console.log('a user disconnected');
        connectedCount -= 1;
        console.log('connected users: ' + connectedCount);
        delete players[socket.playerName];
        console.log(players);

    });


});

function Frame() {
    Object.keys(players).forEach(key => {
        if (players[key].flags[0]) {
            players[key].yDir = -1;
        } else if (players[key].flags[1]) {
            players[key].yDir = 1;
        } else {
            players[key].yDir = 0;
        }
        if (players[key].flags[2]) {
            players[key].xDir = -1;
        } else if (players[key].flags[3]) {
            players[key].xDir = 1;
        } else {
            players[key].xDir = 0;
        }

        if (players[key].xDir != 0 || players[key].yDir != 0) {
            players[key].x += (players[key].xDir / Math.sqrt((Math.pow(players[key].xDir, 2) + Math.pow(players[key].yDir, 2)))) * playerSpeed;
            players[key].y += (players[key].yDir / Math.sqrt((Math.pow(players[key].xDir, 2) + Math.pow(players[key].yDir, 2)))) * playerSpeed;
        }
        io.to(players[key].roomName).emit("updateFrame", players);
    });
}

server.listen(3000, () => {
    console.log('Live on channel 3000');
});