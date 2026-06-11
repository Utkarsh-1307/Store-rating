const { verify } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'));
  }
  const token = header.split(' ')[1];
  try {
    req.user = verify(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = auth;
