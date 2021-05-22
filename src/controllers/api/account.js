const express = require('express');
const mongoose = require('mongoose');
const regex = require('../../helpers/regex');
const mongoReducer = require('../../helpers/mongoReducer');
const Booking = require('../../models/ticketBooking');
const User = require('../../models/user');
const Attraction = require('../../models/attraction');

/**
 * Returns list of all ticket assigned to the user that is currently signed in
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getTickets = async (req, res, next) => {
  try {
    // Get all tickets assigned do current user account
    const tickets = await Booking.find({ user: req.user.id });

    // Reduce query and send a response
    const reduced = tickets.map(mongoReducer);
    res.json(reduced);
  } catch (error) {
    next(error);
  }
};

/**
 * Assigns a ticket to the user that is currently signed in
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const assignTicket = async (req, res, next) => {
  const id = req.params.id;
  const code = req.query.code;

  // Validate object id
  if (!id || !mongoose.isValidObjectId(id))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  // Check if code was provided
  if (!code || !regex.code.test(code))
    return res.status(400).json({ message: 'Invalid code' });

  try {
    // Check if the ticket exists
    const ticket = await Booking.findById(id);
    if (!ticket || ticket.code !== code)
      return res.status(404).json({ message: 'Not found' });

    // Check if the ticket is not assigned
    if (ticket.user) return res.status(409).json({ message: 'Already assigned' });

    // Assign the user
    await ticket.updateOne({ user: req.user });
    res.status(200).json({ message: 'Assigned successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns a planned trip
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const getTrip = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id, { trip: true, _id: false }).populate(
      'trip'
    );
    const attractions = user.trip.map(mongoReducer);
    res.json(attractions);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a planned trip
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const updateTrip = async (req, res, next) => {
  const attractions = req.body;

  if (!Array.isArray(attractions))
    return res.status(400).json({ message: 'Validation failed for `attractions`' });

  // Validate given ids
  const invalid = attractions.filter((id) => !mongoose.isValidObjectId(id));
  if (invalid.length)
    return res
      .status(400)
      .json({ message: 'Validation failed for ObjectId in `attractions`', invalid });

  try {
    // Find corresponding attractions
    const found = await Attraction.find({ _id: { $in: attractions } }, { _id: true });
    const mapped = found.map((attraction) => attraction.id);

    const missing = attractions.filter((id) => !mapped.includes(id));

    if (missing.length)
      return res
        .status(404)
        .json({ message: `Attraction not found for \'${missing.join('`, `')}\`` });

    // Update
    await req.user.updateOne({ trip: attractions });
    res.status(200).json({ message: 'Trip updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTickets, assignTicket, getTrip, updateTrip };
