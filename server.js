const express = require('express');
const moment = require('moment');

const app = express();
const cors = require('cors');

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const chatModel = require('./models/chatModel');

app.use(express.static('public'));

app.use(cors());

const users = {};

io.on('connection', async (socket) => {
  socket.on('nickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('nickname', Object.values(users));
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const timestamp = moment().format('DD-MM-yyyy h:mm:ss A');
    await chatModel.setMessages({ message: chatMessage, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.emit('getMessages', await chatModel.getMessages());

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userDisconnect', Object.values(users));
  });
});

app.get('/', (_req, res) => res.sendFile(`${__dirname}/views/index.html`));

const PORT = 3000;

http.listen(PORT, () => console.log(`Online na Porta: ${PORT}`));