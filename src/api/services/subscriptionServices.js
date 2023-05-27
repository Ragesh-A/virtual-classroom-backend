const Organization = require('../models/organization');
const User = require('../models/user');
const { createOrganization } = require('./organizer');

exports.findSubscribers = async () => {
  const subscribers = await User.find({ subscriber: true }, { password: 0 });
  if (!subscribers) return [];
  return subscribers;
};

exports.createSubscription = async (userId) => {
  const isUpdated = await User.updateOne({ _id: userId }, { $set: { subscriber: true } });
  if (!isUpdated.modifiedCount) throw new Error('subscription is active');
  if (!isUpdated.matchedCount) throw new Error('failed to make the subscription');
  const isOrganization = await Organization.findOne({ subscriber: userId });
  if (!isOrganization) {
    await createOrganization(userId);
  }
  return { message: 'subscription success' };
};
