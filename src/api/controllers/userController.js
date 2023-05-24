const { getUser } = require('../services/user');

exports.profile = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await getUser(_id);
    res.json({ success: { profile: user } });
  } catch (error) {
    res.json({ error: error.message });
  }
};
