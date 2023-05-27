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
