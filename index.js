const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  authControllers,
  userControllers,
  noteControllers,
} = require('./controllers');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/auth', authControllers);
app.use('/api/users', userControllers);
app.use('/api/notes', noteControllers);

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if (!err.message) err.message = 'Server error';
  res.status(statusCode).json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.DB_URL, (err) => {
  if (err) {
    console.log('Database connection error', err.message);
  }
  console.log('Database connection open');
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
