const adminService = require('../services/adminService');

async function getDashboard(req, res) {
  const data = await adminService.getDashboard();
  res.json({ success: true, data });
}

async function getUsers(req, res) {
  const users = await adminService.getUsers(req.query.search, req.query.role);
  res.json({ success: true, data: users });
}

async function getUserById(req, res) {
  const user = await adminService.getUserById(parseInt(req.params.id));
  res.json({ success: true, data: user });
}

async function createUser(req, res) {
  const user = await adminService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
}

async function getStores(req, res) {
  const stores = await adminService.getStores(req.query.search);
  res.json({ success: true, data: stores });
}

async function getStoreById(req, res) {
  const store = await adminService.getStoreById(parseInt(req.params.id));
  res.json({ success: true, data: store });
}

async function createStore(req, res) {
  const store = await adminService.createStore(req.body);
  res.status(201).json({ success: true, data: store });
}

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, getStoreById, createStore };
