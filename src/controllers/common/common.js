const mongoose = require('mongoose');
const reducer = require('../../helpers/mongoReducer');

/**
 * Returns all objects in given collection
 * @param {mongoose.Model<mongoose.Document<any, {}>, {}>} model
 */
const getAll = (model) => async (req, res, next) => {
  try {
    // Get all documents
    const documents = await model.find();
    const reduced = documents.map(reducer);
    res.json(reduced);
  } catch (error) {
    next(error);
  }
};

/**
 * Finds one object in given collection
 * @param {mongoose.Model<mongoose.Document<any, {}>, {}>} model
 */
const getOne = (model) => async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    const document = await model.findById(id);

    if (document) res.status(200).json(reducer(document));
    else res.status(404).json({ message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates new object in given collection
 * @param {mongoose.Model<mongoose.Document<any, {}>, {}>} model
 */
const create = (model) => async (req, res, next) => {
  const document = new model(req.body);

  // Validate document
  const validation = document.validateSync();
  if (validation?.errors) {
    const fields = Object.keys(validation.errors);
    const message = `Validation failed for \`${fields.join('`, `')}\``;
    return res.status(400).json({ message });
  }

  // Save the document
  try {
    const saved = await document.save();
    return res.status(201).json({
      message: 'Document created',
      document: reducer(saved),
    });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000)
      return res.status(409).json({ message: 'This document already exists' });
    next(error);
  }
};

/**
 * Deletes object in given collection
 * @param {mongoose.Model<mongoose.Document<any, {}>, {}>} model
 */
const deleteOne = (model) => async (req, res, next) => {
  const id = req.params.id;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if document exists
    const document = await model.findById(id);
    if (!document) return res.status(404).json({ message: 'Not found' });

    // Delete the document
    await document.delete();

    // Send success message
    res.status(200).json({
      message: 'Document deleted',
      document: reducer(document),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, deleteOne };
