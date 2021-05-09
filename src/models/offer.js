const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  image: { type: String, required: true },
});

const Offer = mongoose.model('offer', offerSchema);

module.exports = Offer;
