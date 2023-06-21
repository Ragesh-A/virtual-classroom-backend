const User = require('../models/user');
const Class = require('../models/class');
const Subscription = require('../models/subscriptionModel');
const Organization = require('../models/organization');

exports.adminDashboard = async () => {
  const usersCountPromise = User.countDocuments();
  const subscribersCountPromise = User.countDocuments({
    'subscriber.status': true,
  });
  const classesCountPromise = Class.countDocuments();
  const subscriptionPromise = Subscription.find().sort({ createdAt: 1 });

  const [usersCount, subscribersCount, classesCount, subscriptions] = await Promise.all([
    usersCountPromise,
    subscribersCountPromise,
    classesCountPromise,
    subscriptionPromise,
  ]);

  return {
    usersCount: usersCount - 1,
    subscribersCount,
    classesCount,
    subscriptions,
  };
};

exports.organizationDashboard = async (userId) => {
  const totalClasses = await Class.countDocuments({
    $or: [{ createdBy: userId, instructor: userId }],
  });

  const organization = await Organization.findOne({ subscriber: userId });
  return { totalClasses, organization };
};
