const userService = require('../services/user');

exports.profile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await userService.getUser(_id);
    res.json({ success: { profile: user } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.allUser = async (req, res) => {
  try {
    const users = await userService.findAll();
    res.json({ success: { users } });
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.blockOrUnblock = async (req, res) => {
  try {
    const { userId } = req.body;
    const response = userService.blockOrUnblock(userId);
    res.json({ success: response });
  } catch (error) {
    res.json({ error: error.message });
  }
};
