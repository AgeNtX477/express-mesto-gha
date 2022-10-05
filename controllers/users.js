const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(ERROR_500).send({ message: err.message }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user.userId)
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(data);
    })
    .catch((err) => res.status(ERROR_500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
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
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};
