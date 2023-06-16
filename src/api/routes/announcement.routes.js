const router = require('express').Router();
const middleware = require('../middleware/index');
const controller = require('../controllers/announcementController');

router.use(middleware.requireSignIn);

router.route('')
  .get(controller.getAnnouncements)
  .post(controller.createAnnouncement);

module.exports = router;
