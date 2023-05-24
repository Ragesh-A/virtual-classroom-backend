const User = require('../models/user');

exports.findUserByEmailOrPhone = async (emailOrPhone) => {
  const user = await User.findOne({ emailOrPhone }, { new: true });
  if (!user) throw new Error('cannot find the user');
  return user;
};

exports.getUser = async (userId) => {
  const user = await User.findOne({ _id: userId });
  return user;
};
