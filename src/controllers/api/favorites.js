const mongoose = require('mongoose');
const mongoReducer = require('../../helpers/mongoReducer');
const Attraction = require('../../models/attraction');

/**
 * Returns list of all attractions marked as favorite
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const all = async (req, res, next) => {
  const favorites = req.user.favorites;

  try {
    // Find all attractions
    const attractions = await Attraction.find({ _id: { $in: favorites } });
    const reduced = Object.values(attractions).map((attraction) =>
      mongoReducer(attraction)
    );

    res.json(reduced);
  } catch (error) {
    next(error);
  }
};

/**
 * Adds an attraction to favorites list
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const add = async (req, res, next) => {
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
    const alreadyExists = user.favorites.some((attraction) => attraction == id);

    if (alreadyExists)
      return res.status(200).json({ message: 'Attraction already in favorites' });

    // Add attraction to favorites if it has not been already saved to favorites
    user.favorites.push(id);
    await user.updateOne({ favorites: user.favorites }, { runValidators: true });

    res.status(200).json({ message: 'Attraction added to favorites' });
  } catch (error) {
    next(error);
  }
};

/**
 * Removes an attraction from favorites list
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const remove = async (req, res, next) => {
  const id = req.body.id;

  // Validate given id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Remove attraction from favorites
    const filtered = req.user.favorites.filter((attraction) => attraction != id);

    if (filtered.length !== req.user.favorites.length) {
      // Update user to delete the attraction
      await req.user.updateOne({ favorites: filtered }, { runValidators: true });
      return res.status(200).json({ message: 'Attraction removed from favorites' });
    } else {
      return res.status(404).json({ message: 'Attraction not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { add, all, remove };