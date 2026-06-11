const { Router } = require('express');
const storeController = require('../controllers/storeController');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const { createStoreSchema } = require('../validations/storeValidators');

const router = Router();

router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);
router.post('/', auth, roles('ADMIN'), validate(createStoreSchema), adminController.createStore);

module.exports = router;
