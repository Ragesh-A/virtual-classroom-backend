const services = require('../services/subscriptionServices');

exports.getSubscriber = async (req, res) => {
  try {
    let subscribers = await services.findSubscribers();
    if (!subscribers) subscribers = [];
    res.json({ success: { subscribers } });
  } catch (error) {
    res.error({ error: error.message });
  }
};

exports.subscriptionIntent = async (req, res) => {
  try {
    const { plan } = req.query;
    const isCreated = await services.createSubscriptionIntent(plan);
    res.json({ success: isCreated });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      paymentIntent, paymentIntentClientSecret, redirectStatus, plan = 'monthly',
    } = req.body;
    console.log(paymentIntent);
    const isCreated = await services
      .createSubscription(_id, plan, paymentIntent, paymentIntentClientSecret, redirectStatus);

    res.json({ success: isCreated });
  } catch (error) {
    res.json({ error: error.message });
  }
};
