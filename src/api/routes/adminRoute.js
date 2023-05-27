const express = require('express');
const { requireSignIn, verifyAdmin } = require('../middlewares');
const user = require('../controllers/userController');

const router = express.Router();

router.use(requireSignIn);
router.use(verifyAdmin);
router.route('/users')
  .get(user.allUser)
  .patch(user.blockOrUnblock);

module.exports = router;