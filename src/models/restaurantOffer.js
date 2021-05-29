const mongoose = require('mongoose');

const restaurantOfferSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Soup', 'Starter', 'Main', 'Pizza', 'Drink', 'Dessert'],
    required: true,
  },
});

const RestaurantOffer = mongoose.model('restaurantoffers', restaurantOfferSchema);

module.exports = RestaurantOffer;
