'use strict'
const path = require('path');
const express = require('express');
const app = express();
const server  = require('http').Server(app);
const io = require('socket.io').listen(server);
const CONFIG = require('../gameConfig');

const PORT = process.env.PORT || 3000;
const MAX_CHAT_HISTORY = 100;

const avatars = [
    'https://react.semantic-ui.com/images/avatar/small/tom.jpg',
    'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    'https://react.semantic-ui.com/images/avatar/small/matthew.png',
    'https://react.semantic-ui.com/images/avatar/small/rachel.png',
    'https://react.semantic-ui.com/images/avatar/small/lindsay.png',
    'https://react.semantic-ui.com/images/avatar/small/jenny.jpg',
    'https://react.semantic-ui.com/images/avatar/small/veronika.jpg',
];

// Game state
const players = {};
let chatMessages = [];

server.listen(PORT, () => {
    console.log(`Alkito server started on port ${PORT}...`);
});

const distPath = path.join(__dirname, '../../dist');

app.use(express.static(distPath));

io.on('connection', function (socket) {
    const newPlayer = {
        id: socket.id,
        name: 'Player #' + Math.floor(Math.random() * 1000),
        avatar: avatars[Math.floor(Math.random() * 7)],
        x: CONFIG.PLAYER_SPAWN_POINT.x,
        y: CONFIG.PLAYER_SPAWN_POINT.y,
    };

    players[socket.id] = newPlayer;

    console.log('User connected: ', newPlayer.name, newPlayer.id);

    // Emit player newly created and current players to user
    socket.emit('playerCreated', players[socket.id]);
    socket.emit('currentPlayers', players);
    // Send chat history after 1 second
    setTimeout(() => {
        socket.emit('chat.newMessage', chatMessages);
    }, 1000);
    // Broadcast the new player to other players
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMove', (x, y) => {
        players[socket.id].x = x;
        players[socket.id].y = y;

        io.emit('playerMoved', players[socket.id]);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('playerDisconnected', players[socket.id]);
        
        delete players[socket.id];
    });

    socket.on('chat.sendNewMessage', (newMessage) => {
        console.log(`> [${newMessage.author}] ${newMessage.message}`)
        io.emit('chat.newMessage', [newMessage]);

        chatMessages.push(newMessage);

        // Keep only MAX_CHAT_HISTORY messages
        if (chatMessages.length > MAX_CHAT_HISTORY) {
            const indexToCut = chatMessages.length - MAX_CHAT_HISTORY;
            chatMessages = chatMessages.slice(indexToCut);
        }
    });
    
});