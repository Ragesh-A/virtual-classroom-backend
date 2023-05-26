const { verifyToken } = require('../utils/jwt');

exports.requireSignIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('unauthorized');
    const token = JSON.parse(authorization);
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.json({ error: error.message, token: false });
  }
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) throw new Error('unauthorized');
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};
