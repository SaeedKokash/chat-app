import './App.css';
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
const socket = io.connect('http://localhost:4000');

function App() {

  // create a state to store the message
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('No Messages Yet');
  const [userName, setUserName] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('send-message', message, userName);
  }

  // listen for receive-message event
  useEffect(() => {
    socket.on('receive-message', (message) => {
      // console.log(message);
      setMessageReceived(message);
      console.log(messageReceived);
    });
  }, []);

  return (
    <div className="App">

      <form onSubmit={sendMessage}>
        <input type="text" name="userName" placeholder="Enter your name" onChange={(e) => setUserName(e.target.value)} />
        <input type="text" name="messageContent" placeholder="Message..." onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      
      <h2>Messages</h2>
      <p>{messageReceived}</p>
      
    </div>
  );
}

export default App;
