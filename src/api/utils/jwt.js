// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error('invalid access token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
