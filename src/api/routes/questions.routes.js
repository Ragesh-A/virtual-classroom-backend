const router = require('express').Router();
const { requireSignIn } = require('../middleware');
const questionsController = require('../controllers/questionsController');

router.use(requireSignIn);
router.get('', questionsController.getClassQuestions);
router.post('', questionsController.create);
router.get('/organization', questionsController.questUserCreatedQuestion);
router.route('/:questionId')
  .get(questionsController.getQuestion);
router.route('/:questionId/submission')
  .get(questionsController.getQuestionSubmissions)
  .post(questionsController.createSubmission);
router.route('/:questionId/isSubmitted')
  .get(questionsController.isSubmitted);

module.exports = router;
