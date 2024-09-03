const mongoose = require('mongoose');

const travDataSchema = new mongoose.Schema({
  id: Number,
  category: String,
  title: String,
  image: String,
  description: String,
  price: Number,
  location: {
    latitude: Number,
    longitude: Number,
  },
  reviews: [
    {
      customerName: String,
      rating: Number,
      comment: String,
    },
  ],
});

module.exports = mongoose.model('TravData', travDataSchema);
