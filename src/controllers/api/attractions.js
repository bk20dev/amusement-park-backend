const mongoose = require('mongoose');
const mongoReducer = require('../../helpers/mongoReducer');
const Attraction = require('../../models/attraction');

/**
 * Updates an attraction
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const update = async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if the attraction exists
    const attraction = await Attraction.findById(id);
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' });

    try {
      // Update the attraction
      await attraction.updateOne(req.body, { runValidators: true });

      // Get updated document for creating a contentful response
      const document = await Attraction.findById(id);
      res.status(200).json({
        message: 'Updated successfully',
        attraction: mongoReducer(document),
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // Send names of fields that failed validation
        const fields = Object.keys(error.errors);
        const message = `Validation failed for \`${fields.join('`, `')}\``;
        return res.status(400).json({ message });
      } else if (error instanceof mongoose.mongo.MongoError && error.code === 11000) {
        // Index duplicate error
        return res
          .status(409)
          .json({ message: 'Document with this name already exists' });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { update };
