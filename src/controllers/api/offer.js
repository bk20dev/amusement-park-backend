const mongoose = require('mongoose');
const reducer = require('../../helpers/mongoReducer');
const Offer = require('../../models/offer');

const update = async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if the offer exists
    const offer = await Offer.findById(id);
    if (!offer) return res.status(404).json({ message: 'Not found' });

    await offer.updateOne(req.body, { runValidators: true });

    const document = await Offer.findById(id);
    res.status(200).json({
      message: 'Updated successfully',
      document: reducer(document),
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      if (error.name === 'ValidationError') {
        // Send names of fields that failed validation
        const fields = Object.keys(error.errors);
        const message = `Validation failed for \`${fields.join('`, `')}\``;
        return res.status(400).json({ message });
      } else if (error.name === 'MongoError' && error.code === 11000) {
        // Index duplicate error
        return res
          .status(409)
          .json({ message: 'Document with this name already exists' });
      }
    }

    next(error);
  }
};

module.exports = { update };
