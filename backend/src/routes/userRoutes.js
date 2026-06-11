const { Router } = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const { createUserSchema } = require('../validations/userValidators');

const router = Router();

router.use(auth, roles('ADMIN'));

router.get('/', adminController.getUsers);
router.get('/:id', adminController.getUserById);
router.post('/', validate(createUserSchema), adminController.createUser);

module.exports = router;
