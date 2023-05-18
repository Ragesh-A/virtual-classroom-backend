// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcrypt');
const User = require('../models/user');

async function generateHashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  if (!hash) return false;
  return hash;
}

const verifyPassword = async (password, hashPassword) => {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
};

exports.registerUser = async (userData) => {
  const existingUser = await User.findOne({
    emailOrPhone: userData.emailOrPhone,
  });
  if (existingUser) throw new Error('user already exists');
  const hashPassword = await generateHashPassword(userData.password);
  if (!hashPassword) throw new Error('error while saving the data');
  const newUser = new User({ ...userData, password: hashPassword });
  await newUser.save();
  return newUser;
};

exports.loginUser = async (emailOrPhone, password) => {
  const existingUser = await User.findOne({ emailOrPhone });
  if (existingUser && (await verifyPassword(password, existingUser.password))) {
    delete existingUser.password;
    return existingUser;
  }
  return false;
};
