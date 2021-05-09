const mongoose = require('mongoose');
const mongoReducer = require('../../helpers/mongoReducer');
const Offer = require('../../models/offer');

const all = async (_, res, next) => {
  try {
    // Get list of all tickets
    const offerings = await Offer.find();
    const reduced = offerings.map(mongoReducer);

    res.json(reduced);
  } catch (error) {
    next(errror);
  }
};

const create = async (req, res, next) => {
  // Check if offer with given name already exisits
  if (req.body.name) {
    try {
      const exists = await Offer.exists({ name: req.body.name });
      if (exists) return res.status(409).json({ message: 'Offer already exists ' });
    } catch (error) {
      return next(error);
    }
  }

  const offer = new Offer(req.body);
  const validation = offer.validateSync();

  // Check for validation errors
  if (validation?.errors) {
    const fields = Object.keys(validation.errors);
    const message = `Validation failed for \`${fields.join('`, `')}\``;
    return res.status(400).json({ message });
  }

  // Save the offer
  try {
    const saved = await offer.save();
    return res.status(201).json({
      message: 'Offer created',
      offer: mongoReducer(saved),
    });
  } catch (error) {
    next(error);
  }
};

const deleteOffer = async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if the offer exists
    const offer = await Offer.findById(id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });

    // Delete offer
    await offer.delete();

    res.status(200).json({
      message: 'Offer deleted',
      offer: mongoReducer(offer),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { all, create, delete: deleteOffer };
