// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const User = require('../models/user');

const phoneRegex = /^\d{3}\d{3}\d{4}$/;

async function generateHashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  if (!hash) return false;
  return hash;
}

const verifyPassword = async (password, hashPassword) => {
  const result = await bcrypt.compare(password, hashPassword);
  if (!result) throw new Error('Invalid user credentials');
  return result;
};

exports.registerUser = async (userData, uuid) => {
  const existingUser = await User.findOne({
    emailOrPhone: userData.emailOrPhone,
  });
  if (phoneRegex.test(userData.emailOrPhone)) {
    throw new Error('sms service unavailable, try email');
  }
  if (existingUser) throw new Error('user already exists');
  const hashPassword = await generateHashPassword(userData.password);
  if (!hashPassword) throw new Error('error while saving the data');
  const newUser = new User({ ...userData, password: hashPassword, uuid });
  await newUser.save();
  return newUser;
};

exports.loginUser = async (emailOrPhone, userPassword) => {
  const existingUser = await User.findOne({ emailOrPhone });
  if (!existingUser) throw new Error('invalid user credentials');
  if (existingUser.isBlocked) throw new Error('you are blocked');
  if (
    existingUser && (await verifyPassword(userPassword, existingUser.password))) {
    if (!existingUser.verified) throw new Error('waiting for email verification');
    return existingUser;
  }
  return false;
};

exports.verifyLink = async (userId, uuid) => {
  let user = await User.findOne({ _id: userId });
  if (user.uuid === uuid) {
    user = await User.updateOne(
      { _id: userId },
      { $set: { verified: true } },
      { new: true },
    );
    return true;
  }
  return false;
};

exports.otp = async (emailOrPhone, otp) => {
  const status = await User.updateOne({ emailOrPhone }, { $set: { uuid: otp } });
  return status;
};

exports.resetUserPassword = async (otp, emailOrPhone, password) => {
  const user = await User.findOne({ emailOrPhone });
  if (!user) throw new Error('failed to find the user');
  if (user.uuid === otp) {
    const hash = await generateHashPassword(password);
    const updated = await User.updateOne({ emailOrPhone }, { password: hash });
  }
};

exports.verifyUserOtp = async (emailOrPhone, uuid) => {
  const user = await User.findOne({ emailOrPhone, uuid });
  if (!user) throw new Error('invalid otp');
  return { message: 'otp verified' };
};
