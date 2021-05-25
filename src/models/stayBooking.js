const mongoose = require('mongoose');
const regex = require('../helpers/regex');

const stayBookingSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  purchasedAt: {
    type: Date,
    required: true,
    default: new Date().getTime(),
  },
  accommodations: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
  code: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.code.test(value) },
    default: () => Math.floor(Math.random() * 1e6),
  },
});

const StayBooking = mongoose.model('staybookings', stayBookingSchema);

module.exports = StayBooking;
