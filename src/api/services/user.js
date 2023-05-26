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

exports.findAll = async () => {
  let allUser = await User.find({ isAdmin: { $not: { $eq: true } } }, { password: 0, isAdmin: 0 });
  if (!allUser) allUser = [];
  return allUser;
};

exports.blockOrUnblock = async (studentId) => {
  const student = await User.findById(studentId);
  if (!student) throw new Error('user not found');
  const action = (student.isBlocked ? false : true);
  const isUpdated = await User.updateOne({ _id: studentId }, { $set: { isBlocked: action } });
  return `used is ${action ? 'blocked' : 'unblocked'} successfully`;
};
