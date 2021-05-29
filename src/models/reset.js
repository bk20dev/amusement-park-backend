const mongoose = require('mongoose');

const resetSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'users',
  },
});

const Reset = mongoose.model('resets', resetSchema);

module.exports = Reset;
