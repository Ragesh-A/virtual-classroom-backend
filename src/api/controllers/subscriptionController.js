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

exports.newSubscription = async (req, res) => {
  try {
    const { _id } = req.user;
    const isCreated = await services.createSubscription(_id);
    res.json({ success: isCreated });
  } catch (error) {
    res.json({ error: error.message });
  }
};
