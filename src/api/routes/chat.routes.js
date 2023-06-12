const express = require('express');
const controller = require('../controllers/chatController');

const router = express.Router({ mergeParams: true });

router.route('')
  .get(controller.allChats)
  .post(controller.accessChat);

router.route('/group')
  // .get(controller.)
  .post(controller.createGroup)
  .patch(controller.updateGroup);

// router.route('/find/:firstId/:secondId')
//   .get(controller.findChat);

module.exports = router;
