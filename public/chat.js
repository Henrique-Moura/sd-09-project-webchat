const socket = window.io();

const dataTestId = 'data-testid';
const formMessage = document.querySelector('.message-box');
const inputMessage = document.querySelector('#message-box');
const inputNickname = document.querySelector('#nickname-box');
const ulMessage = document.querySelector('#message');
const ulUser = document.querySelector('#user');
const formUser = document.querySelector('.nickname-box');

// ref: https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/
const randomString = (tamanho) => {
  let string = '';
  const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let index = 0; index < tamanho; index += 1) {
    string += caracters.charAt(Math.floor(Math.random() * caracters.length));
  }
  return string;
};
let nickname = randomString(16);

socket.emit('nickname', nickname);

const createUser = (users) => {
  ulUser.innerHTML = '';
  const liUser = document.createElement('li');
  liUser.setAttribute(dataTestId, 'online-user');
  ulUser.appendChild(liUser);
  liUser.innerText = `Meu usuário: ${nickname}`;

  users.forEach((newUser) => {
    if (newUser !== nickname) {
      const li = document.createElement('li');
      li.innerText = `Outro usuário: ${newUser}`;
      li.setAttribute(dataTestId, 'online-user');
      ulUser.appendChild(li);
    }
  });
};

socket.on('userDisconnect', (dropUser) => {
  createUser(dropUser);
});

socket.on('nickname', (users) => {
  createUser(users);
});

const createMessage = (message) => {
  const li = document.createElement('li');
  li.className = 'message';
  li.innerText = message;
  li.setAttribute(dataTestId, 'message');
  ulMessage.appendChild(li);
};

formMessage.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', {
    chatMessage: inputMessage.value,
    nickname,
  });
  inputMessage.value = '';
});

formUser.addEventListener('submit', (event) => {
  event.preventDefault();
  nickname = inputNickname.value;

  socket.emit('nickname', nickname);
  inputNickname.value = '';
});

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('getMessages', (oldMessages) => {
  oldMessages.forEach(({ message, nickname: nick, timestamp }) => {
    const li = document.createElement('li');
    li.setAttribute(dataTestId, 'message');
    li.textContent = `${timestamp} - ${nick}: ${message}`;
    ulMessage.appendChild(li);
  });
});