'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// socket io setup
const socketIO = require('socket.io');
const http = require('http');

// message queue setup
const { storeMessage, retrieveMessages } = require('./message-queue.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello to Chat-App')
});

// create an object to store all users inside
const allUsers = {};

// create a new http server for socket io
const server = http.createServer(app);

// create a socket connection
const io = socketIO(server, {
    transport: ['websocket', 'polling'],
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'] 
    }
});

io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // listen for new user
    socket.on('new-user-joined', (userName) => {
        console.log(`a new user connected: ${userName}`);
        allUsers[socket.id] = userName;

        socket.broadcast.emit('new-user-connected', userName);
    });

    // listen for send message and send a message to all users
    socket.on('send-message', (message, userName) => {
        allUsers[socket.id] = userName;
        console.log(`a message is sent: ${userName}, ${message}`);

        socket.broadcast.emit('receive-message', `${userName}: ${message}` )
    });

    // listen for disconnect and remove the user from the allUsers object
    socket.on('disconnect', () => {
        // allUsers[socket.id] = userName;
        // console.log(allUsers[socket.id], userName);
        console.log(`user disconnected: ${socket.id}`);
        // socket.broadcast.emit('user-disconnected', `user disconnected: ${userName}`);
        delete allUsers[socket.id];
    });

});

// create a handler for the message queue system
const messageQueueHandler = (socket) => {
    // When a user disconnects, store the message in the message queue
    socket.on('disconnect', () => {
        storeMessage(socket.id, socket.message);
    });

    // When a user reconnects, retrieve the messages from the message queue and send them to the user
    socket.on('connect', () => {
        retrieveMessages(socket.id);
    });
}

app.get('/messages', (req, res) => {
    res.send('Hello to Chat-App Messages')
});

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server is up and running on port ${PORT}`)
// });

module.exports = { app, io };