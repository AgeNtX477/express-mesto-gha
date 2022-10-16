const Card = require('../models/card');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с указанным _id не найдена.');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenErr('Нельзя удалить карточку другого пользователя.'));
      }
      return card.remove().then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные для удаления карточки.'));
      }
      return next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка не найдена.');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные для постановки лайка.'));
      }
      return next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Передан несуществующий _id карточки.');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestErr('Переданы некорректные данные для снятия лайка.'));
      }
      return next(err);
    });
};
