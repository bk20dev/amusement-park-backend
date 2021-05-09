const mongoose = require('mongoose');
const mongoReducer = require('../../helpers/mongoReducer');
const Attraction = require('../../models/attraction');

/**
 * Returns list of all attractions
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const all = async (_, res, next) => {
  try {
    // Get list of all attractions and prepare data for sending
    const attractions = await Attraction.find();
    const reduced = attractions.map((attraction) => mongoReducer(attraction));
    res.json(reduced);
  } catch (error) {
    next(error);
  }
};

/**
 * Returns one attraction
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const one = async (req, res, next) => {
  const id = req.params.id;

  // Validate given id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    const attraction = await Attraction.findById(id);

    // Return attraction if found, else return an error message
    if (attraction) res.status(200).json(mongoReducer(attraction));
    else res.status(404).json({ message: 'Attraction not found' });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates new attraction
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const create = async (req, res, next) => {
  const attraction = new Attraction(req.body);

  // Check if attraction with given name already exists
  // If so, return an error message
  if (req.body.name) {
    try {
      const exists = await Attraction.exists({ name: req.body.name });
      if (exists) return res.status(400).json({ message: 'Attraction already exists' });
    } catch (error) {
      return next(error);
    }
  }

  const validation = attraction.validateSync();

  // Check for validation errors
  if (validation?.errors) {
    const fields = Object.keys(validation.errors);
    const message = `Validation failed for \`${fields.join('`, `')}\``;
    return res.status(400).json({ message });
  }

  // Save the attraction
  try {
    const saved = await attraction.save();
    return res.status(201).json({
      message: 'Attraction created',
      attraction: mongoReducer(saved),
    });
  } catch (error) {
    next(error);
  }
};

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
      if (!error instanceof mongoose.Error.ValidationError) throw error;

      if (error.name === 'MongoError' && error.code === 11000)
        return res
          .status(400)
          .json({ message: 'Attraction with this name already exists' });

      // If updating failed due to the validation error
      const fields = Object.keys(error.errors);
      const message = `Validation failed for \`${fields.join('`, `')}\``;
      res.status(400).json({ message });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes one attraction
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const deleteAttraction = async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if the attraction exists
    const attraction = await Attraction.findById(id);
    if (!attraction) return res.status(404).json({ message: 'Attraction not found' });

    // Delete existing attraction
    await attraction.delete();

    // Return success message
    res.status(200).json({
      message: 'Attraction deleted',
      attraction: mongoReducer(attraction),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { all, one, create, update, delete: deleteAttraction };
