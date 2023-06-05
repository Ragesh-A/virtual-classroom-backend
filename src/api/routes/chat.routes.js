const express = require('express');
const controller = require('../controllers/chatController');
const { requireSignIn } = require('../middleware/index');

const router = express.Router();

router.use(requireSignIn);

router.route('')
  .get(controller.userChats)
  .post(controller.createChat);

router.route('/find/:firstId/:secondId')
  .get(controller.findChat);

module.exports = router;
