const ownerService = require('../services/ownerService');

async function getDashboard(req, res) {
  const data = await ownerService.getDashboard(req.user.id);
  res.json({ success: true, data });
}

async function getRatings(req, res) {
  const ratings = await ownerService.getRatings(req.user.id);
  res.json({ success: true, data: ratings });
}

module.exports = { getDashboard, getRatings };
