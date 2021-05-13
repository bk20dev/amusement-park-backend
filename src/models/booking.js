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
  linkedUser: {
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
});

const Booking = mongoose.model('bookings', bookingSchema);

module.exports = Booking;
