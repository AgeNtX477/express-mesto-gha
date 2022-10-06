const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestErr = require('../errors/BadRequestErr');
const UnAuthErr = require('../errors/UnAuthErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new UnAuthErr('Некорректный email или пароль.')));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }
      return res.sent(data);
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundErr('Пользователь по указанному _id не найден.');
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы не корректные данные.'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((data) => {
      res.status(201).send({
        name: data.name,
        about: data.about,
        avatar: data.avatar,
        email: data.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr('Пользователь с данным email уже зарегистрирован.'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundErr('Пользователь с указанным _id не найден.');
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении профиля.'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        throw new NotFoundErr('Пользователь с указанным _id не найден.');
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};
