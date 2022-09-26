const User = require('../models/user');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(ERROR_404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.send({ data });
    })
    .catch((err) => res.status(ERROR_500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((data) => res.send(data))
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
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден.' });
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
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};
