const mongoose = require('mongoose');

const attractionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Slide'], required: true },
  difficulty: { type: Number, enum: [0, 1, 2] },
  location: {
    type: mongoose.Schema(
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      { _id: false }
    ),
    required: true,
  },
});

const attraction = mongoose.model('attractions', attractionSchema);

module.exports = attraction;
