const Class = require('../models/class');
const User = require('../models/user');
const { checkSubscriptions } = require('../services/subscriptionServices');
const { verifyToken } = require('../utils/jwt');

exports.requireSignIn = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error('unauthorized');
    const token = JSON.parse(authorization);
    const user = await verifyToken(token);
    const { _id } = user;
    const isUser = await User.findById(_id);
    if (!isUser) throw new Error('user is Blocked');
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

exports.isSubscriber = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    if (!user.subscriber) throw new Error('subscription ended');
    next();
  } catch (error) {
    res.json({ error: error.message });
  }
};

exports.classIsBlocked = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    const { classId } = req.params;
    if (isAdmin) return next();
    const isClass = await Class.findById(classId);
    if (!isClass) throw new Error('no class found');
    if (isClass.isBlocked) throw new Error('class is blocked');
    return next();
  } catch (error) {
    res.json({ error: error.message });
    return false;
  }
};

exports.validateUserSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await checkSubscriptions(_id);
    next();
  } catch (error) {
    res.error({ error: `failed contact support ${error.message}` });
  }
};
