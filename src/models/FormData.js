const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  age: Number,
  gender: String,
  address: String,
});

module.exports = mongoose.model('FormData', formDataSchema);
