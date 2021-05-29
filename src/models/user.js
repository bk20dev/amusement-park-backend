const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const regex = require('../helpers/regex');
const TicketBooking = require('./ticketBooking');
const EmailChange = require('./emailChange');
const Reset = require('./reset');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.password.test(value) },
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attractions',
    required: true,
  },
  trip: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'attractions',
    required: true,
  },
});

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 6);
  next();
});

userSchema.pre('deleteOne', { document: true }, async function (next) {
  const id = this._id;

  try {
    // Unlink tickets
    await TicketBooking.updateMany({ user: id }, { $unset: { user: 1 } });

    // Remove generated tokens
    await EmailChange.deleteOne({ user: id }); // Email change
    await Reset.deleteOne({ user: id }); // Account reset (recovery)

    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('users', userSchema);

module.exports = User;
