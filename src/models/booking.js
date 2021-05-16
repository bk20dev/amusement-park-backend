const mongoose = require('mongoose');
const regex = require('../helpers/regex');

const ticketSchema = mongoose.Schema(
  {
    offer: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'offers',
    },
  },
  { _id: false }
);

const bookingSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: 'users',
  },
  purchasedAt: {
    type: Date,
    required: true,
    default: new Date().getTime(),
  },
  tickets: {
    type: [ticketSchema],
    required: true,
  },
  code: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.code.test(value) },
    default: () => Math.floor(Math.random() * 1e6),
  },
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;
