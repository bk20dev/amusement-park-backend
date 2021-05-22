const express = require('express');
const mongoose = require('mongoose');
const regex = require('../../helpers/regex');
const mongoReducer = require('../../helpers/mongoReducer');
const Booking = require('../../models/ticketBooking');

// Tickets

/**
 * Returns list of all ticket assigned to a user
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

module.exports = { getTickets, assignTicket };
