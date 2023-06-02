const express = require('express');
const { requireSignIn, isSubscriber } = require('../middlewares');
const classes = require('../controllers/classesController');
const organizer = require('../controllers/organizerController');

const router = express.Router();

router.use(requireSignIn);
router.patch('/instructor', organizer.acceptInstructorInvitation);

router.use(isSubscriber);

router.get('/classes', classes.allCreatedClasses);

router.route('/instructor')
  .get(organizer.getInstructors)
  .post(organizer.invitationRequest)
  .delete(organizer.removerInstructor);

router.route('/waiting')
  .patch(organizer.removeFromWaitingList);

module.exports = router;
