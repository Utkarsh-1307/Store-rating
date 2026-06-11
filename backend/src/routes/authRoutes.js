const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validations/authValidators');

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.put('/password', auth, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
