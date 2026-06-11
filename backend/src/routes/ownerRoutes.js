const { Router } = require('express');
const ownerController = require('../controllers/ownerController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

const router = Router();

router.use(auth, roles('STORE_OWNER'));

router.get('/dashboard', ownerController.getDashboard);
router.get('/ratings', ownerController.getRatings);

module.exports = router;
