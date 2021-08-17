// Faça seu código aqui
const app = require('express')();
const cors = require('cors');
const express = require('express');
const http = require('http').createServer(app);
const path = require('path');
const moment = require('moment');

const PORT = 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

app.use(cors());
const chatController = require('./controller/chatController');

io.on('connection', async (socket) => {
  console.log(`${socket.id} se conectou`);
  
  const chatHistory = await chatController.getAll();
  const messages = chatHistory
    .map(({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`);
  
  socket.emit('newConnection', messages);
  socket.on('disconnect', () => console.log(`${socket.id} se desconectou`));
  socket.on('message', ({ chatMessage, nickname }) => {
    const time = moment().format('DD-MM-yyyy HH:mm:ss A');
    const newMessage = `${time} ${nickname} ${chatMessage}`;
    io.emit('message', newMessage);
    chatController.saveMessage(chatMessage, nickname, time);
  });
});

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/chat.html')));

http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));