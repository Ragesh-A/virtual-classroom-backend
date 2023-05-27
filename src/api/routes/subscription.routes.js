const express = require('express');
const controller = require('../controllers/subscriptionController');

const router = express.Router();

router.route('')
  .get(controller.getSubscriber)
  .post(controller.newSubscription);

module.exports = router;
