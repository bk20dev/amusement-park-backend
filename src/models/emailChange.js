const mongoose = require('mongoose');
const regex = require('../helpers/regex');

const emailChangeSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'users',
  },
  new: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
});

const EmailChange = mongoose.model('emailchanges', emailChangeSchema);

module.exports = EmailChange;
