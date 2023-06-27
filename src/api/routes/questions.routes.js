const router = require('express').Router();
const { requireSignIn } = require('../middleware');
const questionsController = require('../controllers/questionsController');

router.use(requireSignIn);
router.get('', questionsController.getClassQuestions);
router.get('/organization', questionsController.questUserCreatedQuestion);
router.post('', questionsController.create);
router.route('/:questionId')
  .get(questionsController.getQuestion);
router.route('/:questionId/submission')
  .post(questionsController.createSubmission);
router.route('/:questionId/isSubmitted')
  .get(questionsController.isSubmitted);

module.exports = router;
