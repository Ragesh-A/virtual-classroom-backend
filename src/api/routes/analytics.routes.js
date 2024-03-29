const router = require('express').Router();
const { requireSignIn } = require('../middleware');
const analyticsController = require('../controllers/analyticsController');

router.use(requireSignIn);
router.route('/admin').get(analyticsController.adminDashboard);
router.route('/organization').get(analyticsController.organizationDashboard);
router.get('/class', analyticsController.classDashboard);

module.exports = router;
