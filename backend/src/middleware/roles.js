const ApiError = require('../utils/ApiError');

const roles = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden'));
  }
  next();
};

module.exports = roles;
