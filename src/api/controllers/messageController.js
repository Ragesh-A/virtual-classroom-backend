const services = require('../services/messageServices');

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, message } = req.body;
    console.log('ji');
    const isSended = await services.send(chatId, senderId, message);
    res.json({ success: { isSended } });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chats = await services.get(chatId);
    res.json({ success: { chats } });
  } catch (error) {
    res.json({ error: { message: error.message } });
  }
};
