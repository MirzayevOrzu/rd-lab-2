const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdDate: {
    type: String,
    default: new Date().toISOString(),
    required: true,
  },
});

module.exports = mongoose.model('Note', noteSchema);
