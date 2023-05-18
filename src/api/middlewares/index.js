const { verifyToken } = require('../utils/jwt');

exports.requireSignIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('unauthorized');
    const token = authorization.split(' ')[0];
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
