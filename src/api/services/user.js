const User = require('../models/user');

exports.findUserByEmailOrPhone = async (emailOrPhone) => {
  const user = await User.findOne({ emailOrPhone });
  if (!user) throw new Error('cannot find the user');
  return user;
};

exports.getUser = async (userId) => {
  const user = await User.findOne({ _id: userId }, { password: 0, isAdmin: 0, uuid: 0 });
  if (!user) throw new Error('no user found');
  return user;
};

exports.findAll = async () => {
  let allUser = await User.find({ isAdmin: { $not: { $eq: true } } }, { password: 0, isAdmin: 0 });
  if (!allUser) allUser = [];
  return allUser;
};

exports.blockOrUnblock = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error('user not found');
  const action = (!user.isBlocked);
  const isUpdated = await User.updateOne({ _id: userId }, { $set: { isBlocked: action } });
  if (isUpdated.modifiedCount) {
    return `used is ${action ? 'blocked' : 'unblocked'} successfully`;
  }
  throw new Error(`failed to ${action ? 'block' : 'unblock'} the user`);
};
