const storeService = require('../services/storeService');

async function getStores(req, res) {
  const stores = await storeService.getStores(req.query.search, req.user?.id);
  res.json({ success: true, data: stores });
}

async function getStoreById(req, res) {
  const store = await storeService.getStoreById(parseInt(req.params.id), req.user?.id);
  res.json({ success: true, data: store });
}

module.exports = { getStores, getStoreById };
