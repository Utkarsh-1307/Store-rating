const { Router } = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

const router = Router();

router.use(auth, roles('ADMIN'));

router.get('/dashboard', adminController.getDashboard);

module.exports = router;
