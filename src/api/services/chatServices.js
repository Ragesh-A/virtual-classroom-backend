const ChatModel = require('../models/chatModel');
const Chat = require('../models/chat');

exports.create = async (sender, receiver, classId) => {
  if (!sender || !receiver) throw new Error('missing contacts');
  const newChat = new ChatModel({ members: [sender, receiver], classId });
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
  const chats = await ChatModel.findOne({
    members: { $all: [firstId, secondId] },
  });
  return chats;
};

// v2
const populateOption = [
  { path: 'users', select: '-password -uuid -isAdmin' },
  { path: 'latestMessage' },
];

exports.findOne = async (classId, userId, receiverId) => {
  const isChat = await Chat.findOne({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
      { class: classId },
    ],
  }).populate(populateOption);

  if (isChat) return isChat;
  const newChat = await new Chat({
    chatName: 'sender',
    isGroup: false,
    class: classId,
    users: [userId, receiverId],
  });
  await newChat.save();
  await newChat.populate(populateOption);
  return newChat;
};

exports.find = async (classId, userId) => {
  const chats = await Chat.find({
    $and: [{ users: { $elemMatch: { $eq: userId } } }, { class: classId }],
  })
    .populate(populateOption)
    .populate('groupAdmin', '-password -uuid -isAdmin')
    .sort({ updatedAt: -1 });
  return chats;
};

exports.newGroup = async (classId, _id, chatName, users = []) => {
  if (users.length < 2) throw new Error('More  than two user is needed to create group');
  const newGroup = new Chat({
    chatName,
    isGroup: true,
    users,
    groupAdmin: _id,
  });
  await newGroup.save();
  await newGroup.populate(populateOption)
    .populate('groupAdmin', '-password -uuid -isAdmin');

  return newGroup;
};

exports.renameGroup = async (groupId, newname) => {
  const updatedGroup = await Chat.updateOne({ _id: groupId }, { chatName: newname }, { new: true })
    .populate(populateOption)
    .populate('groupAdmin', '-password -uuid -isAdmin');
  return updatedGroup;
};

exports.addToGroup = async (chatId, userId) => {
  const isAdded = await Chat.updateOne(
    { _id: chatId },
    { $addToSet: { users: userId } },
    { new: true },
  ).populate(populateOption)
    .populate('groupAdmin', '-password -uuid -isAdmin');
  return isAdded;
};

exports.removeFromGroup = async (chatId, userId) => {
  const removed = await Chat.updateOne({ _id: chatId }, { $pull: { users: userId } })
    .populate(populateOption)
    .populate('groupAdmin', '-password -uuid -isAdmin');
  return removed;
};
