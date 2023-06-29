// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY
  return jwt
  .sign(payload,  SECRET_KEY/* { expiresIn: '1h' */);
}

const verifyToken = async (token) => {
  try {
    const SECRET_KEY = process.env.JWT_SECRET_KEY
    const decoded = await jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error('invalid access token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
