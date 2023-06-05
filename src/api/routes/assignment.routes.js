const router = require('express').Router();
const controller = require('../controllers/assignmentController');
const { requireSignIn } = require('../middleware');

router.use(requireSignIn);
router.post('', controller.create);
router.get('/:classId', controller.findByClass);
router
  .route('/:classId/assignments/:assignmentId')
  .get(controller.getAssignment)
  .patch(controller.updateOne);

router
  .route('/:classId/assignments/:assignmentId/submissions')
  .get(controller.submissions)
  .post(controller.createSubmission);

router
  .route('/:classId/assignments/:assignmentId/submissions/:submissionId')
  .get(controller.findOneSubmission);
// .post

module.exports = router;
