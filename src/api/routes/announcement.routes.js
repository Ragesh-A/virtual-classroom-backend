const router = require('express').Router();
const middleware = require('../middleware/index');
const controller = require('../controllers/announcementController');

router.use(middleware.requireSignIn);

router.route('')
  .get(controller.getAnnouncements)
  .post(controller.createAnnouncement);

router.get('/class/:classId/all', controller.getAllClassAnnouncements);
router.route('/:announcementId')
  .get(controller.getAnnouncement)
  .patch(controller.updateAnnouncement)
  .delete(controller.deleteAnnouncement);
module.exports = router;
