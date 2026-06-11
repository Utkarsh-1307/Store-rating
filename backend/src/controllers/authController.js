const authService = require('../services/authService');

async function register(req, res) {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, data: user });
}

async function login(req, res) {
  const result = await authService.login(req.body.email, req.body.password);
  res.json({ success: true, data: result });
}

async function changePassword(req, res) {
  await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true, message: 'Password updated successfully' });
}

module.exports = { register, login, changePassword };
