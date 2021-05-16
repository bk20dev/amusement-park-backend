const mongoose = require('mongoose');

const accommodationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
    enum: ['Room', 'Chalet', 'Tent'],
  },
  beds: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: { validator: (v) => v >= 0 },
  },
  images: {
    type: [String],
    required: true,
  },
});

const Accommodation = mongoose.model('accommodation', accommodationSchema);

module.exports = Accommodation;
