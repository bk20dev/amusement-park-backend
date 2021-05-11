const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false, default: null },
  price: { type: Number, required: true },
  discountedPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.price;
    },
  },
  image: { type: String, required: true },
});

offerSchema.pre('updateOne', function (next) {
  const update = this.getUpdate();

  // Set null if description is empty
  if ('description' in update && !update.description?.trim()) {
    update.description = null;
  }

  next();
});

const Offer = mongoose.model('offer', offerSchema);

module.exports = Offer;
