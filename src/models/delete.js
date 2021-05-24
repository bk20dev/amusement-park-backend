const mongoose = require('mongoose');

const deleteSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, unique: true },
});

const Delete = mongoose.model('deletes', deleteSchema);

module.exports = Delete;
