const Chat = require('../models/chat');
const MessageModel = require('../models/message');

const populateOption = [
  { path: 'sender', select: '-password -uuid -isAdmin' },
  'chat',
];

exports.send = async (chatId, senderId, message) => {
  if (!chatId || !senderId || !message) throw new Error('missing data');
  const newMessage = new MessageModel({
    chat: chatId,
    sender: senderId,
    content: message,
  });
  await newMessage.save();
  await newMessage.populate(populateOption);
  await newMessage.populate({ path: 'chat.users', select: '-password -uuid -isAdmin' });
  // eslint-disable-next-line no-underscore-dangle
  await Chat.updateOne({ _id: chatId }, { $set: { latestMessage: newMessage._id } });
  return newMessage;
};

exports.get = async (chatId) => {
  const chats = await MessageModel.find({ chat: chatId }).populate(populateOption).populate({ path: 'chat.users', select: '-password -uuid -isAdmin' });
  return chats;
};
