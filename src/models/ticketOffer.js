const mongoose = require('mongoose');
const clamp = require('../utils/clamp');

const ticketOfferSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false, default: null },
  price: {
    type: Number,
    required: true,
    validate: { validator: (v) => v >= 0 },
  },
  discountedPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.price;
    },
    validate: { validator: (v) => v >= 0 },
  },
  image: { type: String, required: true },
});

ticketOfferSchema.pre('save', function (next) {
  // Prevent discounted price to be higher than normal price or lower than 0
  this.discountedPrice = clamp(this.discountedPrice, 0, this.price);
  next();
});

ticketOfferSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate();

  // Set null if description is empty
  if ('description' in update && !update.description?.trim()) {
    update.description = null;
  }

  // Update price and discounted price
  if ('price' in update) {
    if ('discountedPrice' in update) {
      update.discountedPrice = clamp(update.discountedPrice, 0, update.price);
    } else {
      update.discountedPrice = update.price;
    }
  } else if ('discountedPrice' in update) {
    // Fetch current data to properly handle changing prices
    const id = this.getQuery()._id;
    const current = await TicketOffer.findById(id, { price: true });

    update.discountedPrice = clamp(update.discountedPrice, 0, current.price);
  }

  next();
});

const TicketOffer = mongoose.model('ticketoffers', ticketOfferSchema);

module.exports = TicketOffer;
