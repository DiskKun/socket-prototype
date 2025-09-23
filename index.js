const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

direction = [0, 0];

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    setInterval(() => {socket.emit("updateFrame");}, 16)

    

    socket.on('keyDown', (key_in) => {
        socket.emit("key_event", key_in);
        console.log("Key: " + key_in);
    });
});



server.listen(3000, () => {
    console.log('Live on channel 3000');
});