const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const { chatController } = require('./controller/chatController');
const { formatMessage, getFullDate } = require('./utils');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '/views')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', chatController);

const server = app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('message', ({ chatMessage, nickname }) => {
        const date = getFullDate();
        const messageFormated = formatMessage(date, nickname, chatMessage);
        io.emit('message', messageFormated);
    });
});