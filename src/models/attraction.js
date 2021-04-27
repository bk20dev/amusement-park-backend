const mongoose = require('mongoose');

const locationSchema = mongoose.Schema(
  { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
);

const attractionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Slide'], required: true },
  difficulty: { type: Number, enum: [0, 1, 2], default: null },
  location: {
    type: locationSchema,
    required: true,
  },
});

const attraction = mongoose.model('attractions', attractionSchema);

module.exports = attraction;
