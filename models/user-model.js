const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  createdDate: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
