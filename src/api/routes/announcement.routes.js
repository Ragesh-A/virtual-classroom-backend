const router = require('express').Router();
const middleware = require('../middleware/index');
const controller = require('../controllers/announcementController');

router.use(middleware.requireSignIn);

router.route('')
  .get(controller.getAnnouncements)
  .post(controller.createAnnouncement);

router.get('/all', controller.allAnnouncements);
router.route('/:announcementId')
  .get(controller.getAnnouncement)
  .patch(controller.updateAnnouncement);

module.exports = router;
