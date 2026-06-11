const { Router } = require('express');
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const validate = require('../middleware/validate');
const { submitRatingSchema, updateRatingSchema } = require('../validations/ratingValidators');

const router = Router();

router.use(auth, roles('USER'));

router.post('/', validate(submitRatingSchema), ratingController.submitRating);
router.put('/:id', validate(updateRatingSchema), ratingController.updateRating);
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
