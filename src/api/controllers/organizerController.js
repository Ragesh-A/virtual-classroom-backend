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

exports.acceptInstructorInvitation = async (req, res) => {
  try {
    const { uuid, organizationId } = req.body;
    const { _id } = req.user;
    const isVerified = await services.acceptInvitation(_id, uuid, organizationId);
    res.json({ success: { isVerified } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const { _id } = req.user;
    const instructors = await services.findInstructors(_id);
    res.json({ success: { instructors } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
