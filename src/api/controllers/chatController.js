const services = require('../services/chatServices');

exports.createChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const chat = await services.create(senderId, receiverId);
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
