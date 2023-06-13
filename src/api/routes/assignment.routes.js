const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/assignmentController');
// const { requireSignIn } = require('../middleware');
const { uploadAssignmentImage, uploadSubmissionImage } = require('../utils/imageHelper');

router.route('/')
  .get(controller.findByClass)
  .post(uploadAssignmentImage.single('image'), controller.create);

router
  .route('/:assignmentId')
  .get(controller.getAssignment)
  .patch(uploadAssignmentImage.single('image'), controller.updateOne);

router
  .route('/:assignmentId/submissions')
  .get(controller.submissions)
  .post(uploadSubmissionImage.array('images'), controller.createSubmission);

router
  .route('/submissions/:submissionId')
  .get(controller.findOneSubmission);

module.exports = router;
