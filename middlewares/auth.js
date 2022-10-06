const jwt = require('jsonwebtoken');
const UnAuthErr = require('../errors/UnAuthErr');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthErr('Ошибка авторизации.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new UnAuthErr('Необходима авторизация.'));
  }

  req.user = payload;

  return next();
};
