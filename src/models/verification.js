const mongoose = require('mongoose');
const regex = require('../helpers/regex');

const verificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  iat: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const Verification = mongoose.model('verifications', verificationSchema);

module.exports = Verification;
