const User = require('../models/user');

exports.findSubscribers = async () => {
  const subscribers = await User.find({ subscriber: true }, { password: 0 });
  if (!subscribers) return [];
  return subscribers;
};
