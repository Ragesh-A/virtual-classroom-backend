const MessageModel = require('../models/messageModel');

exports.send = async (chatId, senderId, message) => {
  if (!chatId || !senderId || !message) throw new Error('missing data');
  const newMessage = new MessageModel({
    chatId,
    senderId,
    message,
  });
  await newMessage.save();
  return newMessage;
};

exports.get = async (chatId) => {
  const chats = await MessageModel.find({ chatId });
  return chats;
};
