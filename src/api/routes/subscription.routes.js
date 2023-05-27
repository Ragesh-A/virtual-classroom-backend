const express = require('express');
const controller = require('../controllers/subscriptionController');

const router = express.Router();

router.route('')
  .get(controller.getSubscriber);

module.exports = router;
