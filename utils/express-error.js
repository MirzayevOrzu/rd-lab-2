/* eslint-disable require-jsdoc */
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message || 'Server error';
    this.statusCode = statusCode || 500;
  }
};

module.exports = ExpressError;
