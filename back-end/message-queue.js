'use strict';

const io = require('./server.js');

// This is the object that will store the messages for each user
const messageQueue = {};

// This function will be called when a user disconnects from the server
// It will store the message in the message queue
const storeMessage = (userId, message) => {

    // If the user doesn't exist in the message queue, create an empty array for him
    if (!messageQueue[userId]) {
        messageQueue[userId] = [];
    }
    
    // Add the message to the message queue
    messageQueue[userId].push(message);
    }

// This function will be called when a user reconnects to the server
// It will retrieve the messages from the message queue and send them to the user
const retrieveMessages = (userId) => {

    // If the user doesn't exist in the message queue, return
    if (!messageQueue[userId]) {
        return;
    }

    // Send the messages to the user
    io.emit('receive-message', messageQueue[userId]);

    // Delete the messages from the message queue
    delete messageQueue[userId];
}

module.exports = {
    storeMessage,
    retrieveMessages
}
