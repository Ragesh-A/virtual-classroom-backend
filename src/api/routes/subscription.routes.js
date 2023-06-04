const express = require('express');
const controller = require('../controllers/subscriptionController');
const { requireSignIn } = require('../middlewares');

const router = express.Router();

router.use(requireSignIn);
router.route('')
  .get(controller.subscriptionIntent)
  .post(controller.createSubscription);

module.exports = router;
