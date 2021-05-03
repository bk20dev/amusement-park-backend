const mongoose = require('mongoose');

const resetSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, unique: true },
});

const reset = mongoose.model('resets', resetSchema);

module.exports = reset;
