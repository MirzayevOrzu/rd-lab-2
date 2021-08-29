/* eslint-disable new-cap */
const express = require('express');
const {isLoggedIn} = require('../middlewares');
const {Note} = require('../models');
const {catchError, ExpressError} = require('../utils');
const router = express.Router();

router.post('/', isLoggedIn, catchError(async (req, res, next) => {
  const {text} = req.body;
  const {_id} = req.user;

  const note = new Note({
    userId: _id,
    completed: false,
    text,
    createdDate: new Date().toISOString(),
  });
  await note.save();

  res.status(200).json({
    message: 'Success',
  });
}));

router.get('/', isLoggedIn, catchError(async (req, res, next) => {
  const {offset = 0, limit = 0} = req.query;
  const {_id} = req.user;

  Note
      .find({userId: _id})
      .select('_id userId completed text createdDate')
      .sort('createdDate')
      .skip(Number(offset || 0))
      .limit(Number(limit || 1))
      .exec((err, notes) => {
        if (err) {
          return next(new ExpressError(err.message, 500));
        }

        res.status(200).json({
          offset: Number(offset),
          limit: Number(limit),
          count: Number(limit),
          notes,
        });
      });
}));

router.get('/:id', isLoggedIn, catchError(async (req, res, next) => {
  const {id} = req.params;
  const {_id} = req.user;

  const note = await Note.findOne({_id: id, userId: _id});

  res.status(200).json({
    note: {
      _id: note._id,
      userId: note.userId,
      completed: note.completed,
      text: note.text,
      createdDate: note.createdDate,
    },
  });
}));

router.put('/:id', isLoggedIn, catchError(async (req, res, next) => {
  const {id} = req.params;
  const {text} = req.body;
  const {_id} = req.user;

  if (!text) {
    return next(new ExpressError('text is required', 400));
  }

  const note = await Note.findOne({_id: id, userId: _id});
  note.text = text;
  await note.save();

  res.status(200).json({
    message: 'Success',
  });
}));

router.patch('/:id', isLoggedIn, catchError(async (req, res, next) => {
  const {id} = req.params;
  const {_id} = req.user;

  const note = await Note.findOne({_id: id, userId: _id});
  note.completed = !note.completed;
  await note.save();

  res.status(200).json({
    message: 'Success',
  });
}));

router.delete('/:id', isLoggedIn, catchError(async (req, res, next) => {
  const {id} = req.params;
  const {_id} = req.user;

  await Note.findOneAndRemove({_id: id, userId: _id});

  res.status(200).json({
    message: 'Success',
  });
}));

module.exports = router;
