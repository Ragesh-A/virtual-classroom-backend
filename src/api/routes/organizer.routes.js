const express = require('express');
const { requireSignIn, isSubscriber } = require('../middlewares');
const classes = require('../controllers/classesController');
const organizer = require('../controllers/organizerController');

const router = express.Router();

router.use(requireSignIn);
router.use(isSubscriber);
router.get('/classes', classes.allCreatedClasses);
router.route('/instructor')
  .post(organizer.joinRequest);

module.exports = router;
