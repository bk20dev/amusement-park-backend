const mongoose = require('mongoose');

const stayOfferSchema = mongoose.Schema({
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

const StayOffer = mongoose.model('stayoffer', stayOfferSchema);

module.exports = StayOffer;
