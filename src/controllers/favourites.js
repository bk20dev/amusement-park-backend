const mongoose = require('mongoose');
const Attraction = require('../models/attraction');
const attractionReducer = require('../helpers/attractionReducer');

class FavouriteAttractionsController {
  /**
   * Returns list of all attractions marked as favourite
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async all(req, res, next) {
    const favourites = req.user.favourites;

    try {
      // Find all attractions
      const attractions = await Attraction.find({ _id: { $in: favourites } });
      const reduced = Object.values(attractions).map((attraction) =>
        attractionReducer(attraction._doc)
      );

      res.json(reduced);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adds an attraction to favourites listg
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async add(req, res, next) {
    const id = req.body.id;

    // Validate given id
    if (!id || !mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid ObjectId' });

    try {
      // Check if attraction exists
      const attraction = await Attraction.findById(id);
      if (!attraction) return res.status(404).json({ message: 'Attraction not found' });

      const user = req.user;

      // prettier-ignore
      const alreadyExists = user.favourites.some((attraction) => attraction == id);

      if (alreadyExists)
        return res.status(200).json({ message: 'Attraction already in favourites' });

      // Add attraction to favourites if it has not been already favourited
      user.favourites.push(id);
      await user.updateOne({ favourites: user.favourites }, { runValidators: true });

      res.status(200).json({ message: 'Attraction added to favourites' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Removes an attraction from favourites list
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static async remove(req, res, next) {
    const id = req.body.id;

    // Validate given id
    if (!id || !mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid ObjectId' });

    try {
      // Remove attraction from favourites
      const filtered = req.user.favourites.filter((attraction) => attraction != id);

      if (filtered.length !== req.user.favourites.length) {
        // Update user to delete the attraction
        await req.user.updateOne({ favourites: filtered }, { runValidators: true });
        return res.status(200).json({ message: 'Attraction removed from favourites' });
      } else {
        return res.status(404).json({ message: 'Attraction not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavouriteAttractionsController;
