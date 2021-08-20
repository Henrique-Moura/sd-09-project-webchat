const connection = require('./connection');

const getChat = async () => {
  const result = await connection();
  return result.collection('messages').find().toArray();
};

const insertMessage = async (data) => {
  const result = await connection();
  return result.collection('messages').insertOne(data).then(({ ops }) => ops[0]);
};

module.exports = {
  getChat,
  insertMessage,
};