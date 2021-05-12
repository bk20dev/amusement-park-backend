const mongoose = require('mongoose');
const Restaurant = require('../../models/restaurant');
const reducer = require('../../helpers/mongoReducer');

const update = async (req, res, next) => {
  const id = req.params.id;

  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if the dish exists
    const dish = await Restaurant.findById(id);
    if (!dish) return res.status(404).json({ message: 'Not found' });

    // Update the dish
    await dish.updateOne(req.body, { runValidators: true });

    // Send success response
    const updated = await Restaurant.findById(id);
    res.status(200).json({
      message: 'Document updated',
      document: reducer(updated),
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      // Send names of fields that failed validation
      const fields = Object.keys(error.errors);
      const message = `Validation failed for \`${fields.join('`, `')}\``;
      return res.status(400).json({ message });
    } else if (error instanceof mongoose.mongo.MongoError && error.code === 11000) {
      // Index duplicate error
      return res.status(409).json({ message: 'Document with this name already exists' });
    }

    next(error);
  }
};

module.exports = update;
