const express = require('express');
const controller = require('../controllers/subscriptionController');
const { requireSignIn } = require('../middlewares');

const router = express.Router();

router.use(requireSignIn);
router.route('')
  .get(controller.getSubscriber)
  .post(controller.newSubscription);

module.exports = router;
