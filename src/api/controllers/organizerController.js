const services = require('../services/organizer');

exports.joinRequest = async (req, res) => {
  try {
    const { emailOrPhone, message } = req.body;
    const { _id: userId } = req.user;
    const isSended = await services.sendJoinRequest(emailOrPhone, userId, message);
    res.json({ success: isSended });
  } catch (error) {
    res.json({ error: error.message });
  }
};
