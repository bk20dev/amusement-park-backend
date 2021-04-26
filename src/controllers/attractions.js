const mongoose = require('mongoose');
const attractionReducer = require('../helpers/attractionReducer');
const Attraction = require('../models/attraction');

class AttractionsController {
  /**
   * Returns list of all attractions
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async getAll(_, res, next) {
    try {
      // Get list of all attractions and prepare data for sending
      const attractions = await Attraction.find();
      const reduced = attractions.map((attraction) => attractionReducer(attraction._doc));
      res.json(reduced);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns one attraction
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async getOne(req, res, next) {
    const id = req.params.id;

    // Validate given id
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid ObjectId' });

    try {
      const attraction = await Attraction.findById(id);

      // Return attraction if found, else return an error message
      if (attraction) res.status(200).json(attractionReducer(attraction._doc));
      else res.status(404).json({ message: 'Attraction not found' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates new attraction
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async create(req, res, next) {
    const attraction = new Attraction(req.body);

    // Check if attraction with given name already exists
    // If so, return an error message
    if (req.body.name) {
      try {
        const exists = await Attraction.exists({ name: req.body.name });
        if (exists) return res.status(400).json({ message: 'Attraction already exists' });
      } catch (error) {
        next(error);
      }
    }

    const validation = attraction.validateSync();

    // Check for validation errors
    if (validation?.errors) {
      const fields = Object.keys(validation.errors);
      const message = `Validation failed for \`${fields.join('`, `')}\`.`;
      return res.status(400).json({ message });
    }

    try {
      // Save the attraction
      const saved = await attraction.save();
      return res.status(201).json({
        message: 'Attraction created',
        attraction: attractionReducer(saved._doc),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes one attraction
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async delete(req, res, next) {
    const id = req.params.id;

    // Validate object id
    if (!mongoose.isValidObjectId(id))
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
        attraction: attractionReducer(attraction._doc),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AttractionsController;
