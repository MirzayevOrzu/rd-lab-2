/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const {User} = require('../models');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ExpressError, catchError} = require('../utils');
const {body, validationResult} = require('express-validator');

router.post(
    '/register',
    body('username').isString(),
    body('password').isString(),
    catchError(async (req, res, next) => {
      const {username, password} = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: `${errors.array()[0].msg} ${errors.array()[0].param}`,
        });
      }

      const existingUser = await User.findOne({username});
      if (existingUser) {
        return next(new ExpressError(`User ${username} already exist`, 400));
      };
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = new User({username, password: hashedPassword});
      await user.save();
      res.status(200).json({
        message: 'Success',
      });
    }),
);

router.post(
    '/login',
    body('username').isString(),
    body('password').isString(),
    catchError(async (req, res, next) => {
      const {username, password} = req.body;
      const errors = validationResult(req);
      const user = await User.findOne({username});

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: `${errors.array()[0].msg} ${errors.array()[0].param}`,
        });
      }

      if (!user) {
        return next(new ExpressError(`No user ${username} found`, 400));
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(new ExpressError('Invalid password', 400));
      }

      const token = jwt.sign(
          {username, _id: user._id},
          process.env.JWT_SECRET,
          {expiresIn: '5h'},
      );

      res.status(200).json({
        message: 'Success',
        jwt_token: token,
      });
    }),
);

module.exports = router;

