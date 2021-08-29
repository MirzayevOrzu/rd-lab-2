/* eslint-disable camelcase */
const {ExpressError} = require('../utils');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const {jwt_token} = req.headers;

  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(jwt_token);
      next(new ExpressError('Token is not valid', 400));
    } else {
      req.user = decoded;
      next();
    }
  });
};
