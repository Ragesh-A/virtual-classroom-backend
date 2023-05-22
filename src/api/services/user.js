const User = require('../models/user');

exports.findUserByEmailOrPhone = async (emailOrPhone) => {
  const user = await User.findOne({ emailOrPhone }, { new: true });
  if (!user) throw new Error('cannot find the user');
  return user;
};

exports.profile = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  res.json({
    success: { profile: user },
  });
};
