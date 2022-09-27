const Card = require('../models/card');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((err) => res.status(ERROR_500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(ERROR_404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};
