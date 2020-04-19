const path = require('path');
const express = require('express');
const app = express();
const server  = require('http').Server(app);
const io = require('socket.io').listen(server);

const PORT = process.env.PORT || 3000;
const players = {};

server.listen(PORT, () => {
    console.log(`Alkito server started on port ${PORT}...`);
});

const distPath = path.join(__dirname, '../../dist');

app.use(express.static(distPath));

io.on('connection', function (socket) {
    console.log('User connected: ', socket.id);

    players[socket.id] = {
        id: socket.id,
        x: 75,
        y: 61,
    };

    socket.emit('playerCreated', players[socket.id]);
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);


    socket.on('playerMove', (x, y) => {
        players[socket.id].x = x;
        players[socket.id].y = y;

        console.log('Player move', players[socket.id]);
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);

        delete players[socket.id];
    });
});