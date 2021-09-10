const connection = require('./connection');

const setMessages = async (data) => {
  await connection()
  .then((db) => db.collection('messages').insertOne(data));
};

const getMessages = async () => {
  const chat = await connection()
    .then((db) => db.collection('messages').find().toArray());

  return chat;
};

module.exports = {
  setMessages,
  getMessages,
};