const router = require('express').Router();
const { requireSignIn } = require('../middleware');
const questionsController = require('../controllers/questionsController');

router.use(requireSignIn);
router.get('', questionsController.getClassQuestions);
router.post('', questionsController.create);
router.route('/:questionId')
  .get(questionsController.getQuestion);
router.route('/:questionId/submission')
  .post(questionsController.createSubmission);

module.exports = router;
