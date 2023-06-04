const { STRIPE_SECRET_KEY, PUBLISHABLE_STRIPE_KEY } = process.env;
// eslint-disable-next-line import/no-extraneous-dependencies
const Stripe = require('stripe');
const Organization = require('../models/organization');
const User = require('../models/user');
const { createOrganization } = require('./organizer');
const { classSubscription } = require('./classes');

exports.findSubscribers = async () => {
  const subscribers = await User.find({ subscriber: true }, { password: 0 });
  if (!subscribers) return [];
  return subscribers;
};

exports.createSubscriptions = async (userId) => {
  const isUpdated = await User.updateOne(
    { _id: userId },
    { $set: { subscriber: true } },
  );
  if (!isUpdated.modifiedCount) throw new Error('subscription is active');
  if (!isUpdated.matchedCount) throw new Error('failed to make the subscription');
  const isOrganization = await Organization.findOne({ subscriber: userId });
  if (!isOrganization) {
    await createOrganization(userId);
  }
  return { message: 'subscription success' };
};
exports.sent = async () => ({
  key: STRIPE_SECRET_KEY,
  basicAmount: 10,
  proAmount: 100,
});

exports.createSubscriptionIntent = async (plan = '') => {
  let amount = 1000;
  if (plan === 'yearly') {
    amount = 10000;
  }
  const stripeClient = new Stripe(STRIPE_SECRET_KEY);
  const paymentIntent = await stripeClient.paymentIntents.create({
    amount,
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return {
    clientSecret: paymentIntent.client_secret,
    publicKey: PUBLISHABLE_STRIPE_KEY,
  };
};

exports.createSubscription = async (
  _id,
  plan,
  paymentIntent,
  paymentIntentClientSecret,
  redirectStatus,
) => {
  if (redirectStatus !== 'succeeded') {
    throw new Error('Payment failed');
  }

  const currentDate = new Date();

  let expireDate = plan === 'yearly'
    ? new Date(
      currentDate.getFullYear() + 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    )
    : new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
    );

  const user = await User.findById(_id);
  const isOrganization = await Organization.findOne({ subscriber: _id });
  if (!isOrganization) {
    await createOrganization(_id);
  }

  if (user.subscriber.status) {
    const currentExpireDate = new Date(user.subscriber.expire);
    expireDate = new Date(
      currentExpireDate.getFullYear() + (plan === 'yearly' ? 1 : 0),
      currentExpireDate.getMonth() + (plan === 'yearly' ? 0 : 1),
      currentDate.getDate(),
    );
  }

  await classSubscription(_id, true);

  const data = {
    status: true,
    expire: expireDate,
  };
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { $set: { subscriber: data } },
    { new: true },
  );

  if (!updatedUser) {
    throw new Error('Something went wrong');
  }

  return updatedUser;
};

exports.checkSubscriptions = async (_id) => {
  const subscriber = await User.findById(_id);
  if (!subscriber.subscriber.status) return true;
  if (subscriber.subscriber.status) {
    if (!subscriber.subscriber.expire > Date.now()) return true;
    const isUpdated = await User.updateOne({ _id }, { $set: { 'subscriber.status': false } });
    if (!isUpdated) return false;
    const classUpdate = await classSubscription(_id, false);
    if (!classUpdate) return false;
    return false;
  }
  return true;
};
