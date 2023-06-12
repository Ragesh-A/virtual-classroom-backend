const services = require('../services/chatServices');

exports.createChat = async (req, res) => {
  try {
    const { _id } = req.user;
    const { classId, receiverId } = req.body;
    const chat = await services.create(_id, receiverId, classId);
    res.json({ success: { chat } });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
};

exports.userChats = async (req, res) => {
  try {
    const { _id } = req.user;
    const chats = await services.usersChat(_id);
    res.json({ success: { chats } });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
};

exports.findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;
    const chats = await services.findChats(firstId, secondId);
    res.json({ success: { chats } });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
};

// v2

exports.accessChat = async (req, res) => {
  try {
    const { _id } = req.user;
    const { classId } = req.params;
    const { receiverId } = req.body;
    if (!receiverId) throw new Error('your friend is missing');
    const isChat = await services.findOne(classId, _id, receiverId);
    res.json({ success: isChat });
  } catch (error) {
    res.json({ error });
  }
};

exports.allChats = async (req, res) => {
  try {
    const { _id } = req.user;
    const { classId } = req.params;
    const chats = await services.find(_id, classId);
    res.json({ success: { chats } });
  } catch (error) {
    res.json({ error });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { classId } = req.params;
    const { _id } = req.user;
    const { groupName, users } = req.body;
    const group = await services.newGroup(classId, _id, groupName, users);
    res.json({ success: { group } });
  } catch (error) {
    res.json({ error });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { q } = req.query;
    const { user, chatId } = req.body;
    const { newName } = req.body;
    let result;
    switch (q) {
      case 'rename':
        result = await services.renameGroup(chatId, newName);
        break;
      case 'remove':
        result = await services.removeFromGroup(chatId, user);
        break;
      case 'add':
        result = await services.addToGroup(chatId, user);
        break;
      default: throw new Error('invalid request');
    }
    res.json({ success: result });
  } catch (error) {
    res.json({ error });
  }
};
