const services = require('../services/organizer');

exports.invitationRequest = async (req, res) => {
  try {
    const { emailOrPhone, message } = req.body;
    const { _id: userId } = req.user;
    const isSended = await services.sendInvitationRequest(emailOrPhone, userId, message);
    res.json({ success: isSended });
  } catch (error) {
    res.json({ error: error.message });
  }
};
