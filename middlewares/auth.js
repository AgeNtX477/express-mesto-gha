const jwt = require('jsonwebtoken');
const UnAuthErr = require('../errors/UnAuthErr');

const { JWB_SECRET = 'super-strong-secret' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnAuthErr('Ошибка авторизации.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWB_SECRET);
  } catch (err) {
    next(new UnAuthErr('Необходима авторизация.'));
  }

  req.user = payload;

  next();
};
