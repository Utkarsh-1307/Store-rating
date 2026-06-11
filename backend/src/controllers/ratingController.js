const ratingService = require('../services/ratingService');

async function submitRating(req, res) {
  const rating = await ratingService.submitRating(req.user.id, req.body.storeId, req.body.value);
  res.status(201).json({ success: true, data: rating });
}

async function updateRating(req, res) {
  const rating = await ratingService.updateRating(req.user.id, parseInt(req.params.id), req.body.value);
  res.json({ success: true, data: rating });
}

async function deleteRating(req, res) {
  await ratingService.deleteRating(req.user.id, parseInt(req.params.id));
  res.json({ success: true, message: 'Rating deleted' });
}

module.exports = { submitRating, updateRating, deleteRating };
