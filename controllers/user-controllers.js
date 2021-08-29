/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const {User, Note} = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const {isLoggedIn} = require('../middlewares');
const {catchError, ExpressError} = require('../utils/');

router.get('/me', isLoggedIn, catchError(async (req, res, next) => {
  const {_id, username} = req.user;
  const user = await User.findById(_id);

  res.status(200).json({
    user: {
      _id,
      username,
      createdDate: user.createdDate,
    },
  });
}));

router.patch('/me', isLoggedIn, catchError(async (req, res, next) => {
  const {_id} = req.user;
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(_id);
  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    return next(new ExpressError('Incorrect password', 400));
  }

  const password = bcrypt.hashSync(newPassword, 10);
  user.password = password;
  await user.save();

  res.status(200).json({
    message: 'Success',
  });
}));

router.delete('/me', isLoggedIn, catchError(async (req, res, next) => {
  const {_id} = req.user;

  await User.findByIdAndRemove(_id);
  await Note.deleteMany({userId: _id});

  res.status(200).json({
    message: 'Success',
  });
}));

module.exports = router;
