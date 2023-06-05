const ChatModel = require('../models/chatModel');

exports.create = async (sender, receiver) => {
  if (!sender || !receiver) throw new Error('missing contacts');
  const newChat = new ChatModel({ members: [sender, receiver] });
  await newChat.save();
  return newChat;
};

exports.usersChat = async (userId) => {
  const chats = await ChatModel.find({
    members: { $in: [userId] },
  }).populate({ path: 'members', select: '-password' });
  return chats;
};

exports.findChats = async (firstId, secondId) => {
  const chats = await ChatModel.findOne({ members: { $all: [firstId, secondId] } });
  return chats;
};
