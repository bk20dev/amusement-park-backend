const mongoose = require('mongoose');
const regex = require('../helpers/regex');

const verificationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  expires: {
    type: Date,
    default: Date.now(),
    expires: 432000, // Expires after 5 days
  },
});

const Verification = mongoose.model('verifications', verificationSchema);

module.exports = Verification;
