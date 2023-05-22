const { verifyToken } = require('../utils/jwt');

exports.requireSignIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('unauthorized');
    const token = JSON.parse(authorization);
    const user = await verifyToken(token);
    req.user = user;
    console.log('here also');
    next();
  } catch (error) {
    console.log('here');
    res.json({ error: error.message, token: false });
  }
};
