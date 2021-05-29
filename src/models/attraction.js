const mongoose = require('mongoose');
const User = require('./user');

const locationSchema = mongoose.Schema(
  { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
);

const attractionSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'Roller Coaster',
      'Ferris Wheel',
      'Swing',
      'Cinema',
      'Restaurant',
      'Racing',
      'Other',
    ],
    required: true,
  },
  difficulty: { type: Number, enum: [0, 1, 2], default: null },
  location: {
    type: locationSchema,
    required: true,
  },
});

attractionSchema.pre('remove', async function (next) {
  try {
    // Drop all references to this attraction
    await User.updateMany({}, { $pullAll: { favorites: [this.id], trip: [this.id] } });
    next();
  } catch (error) {
    next(error);
  }
});

const attraction = mongoose.model('attractions', attractionSchema);

module.exports = attraction;
