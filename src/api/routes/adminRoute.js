const express = require('express');
const { requireSignIn, verifyAdmin } = require('../middlewares');
const user = require('../controllers/userController');
const Class = require('../controllers/classesController');

const router = express.Router();

router.use(requireSignIn);
router.use(verifyAdmin);
router.route('/users')
  .get(user.allUser)
  .patch(user.blockOrUnblock);

router.route('/classes')
  .get(Class.getAllClasses)
  .patch(Class.blockOrUnblock);

module.exports = router;
