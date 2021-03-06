const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const regex = require('../../helpers/regex');
const mongoReducer = require('../../helpers/mongoReducer');
const prepareEmailChangeEmail = require('../../emails/generators/account/changeEmail');
const prepareAccountDeleteEmail = require('../../emails/generators/account/delete');
const transporter = require('../../connection/mail');
const Booking = require('../../models/ticketBooking');
const User = require('../../models/user');
const Attraction = require('../../models/attraction');
const EmailChange = require('../../models/emailChange');
const Delete = require('../../models/delete');

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
    const user = await User.findById(req.user.id, { trip: true }).populate('trip');
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

/**
 * Changes user password
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const changePassword = async (req, res, next) => {
  const current = req.body.current;
  const newPassword = req.body.new;

  // Check if current password is given
  if (!current) return res.status(400).json({ message: 'Current password missing' });

  // Check if new password is valid
  if (!regex.password.test(newPassword))
    return res.status(400).json({ message: 'Validation failed for `new`' });

  // Check if current password is correct
  if (!req.user.isPasswordCorrect(current))
    return res.status(401).json({ message: 'Incorrect password' });

  if (current === newPassword)
    return res.status(409).json({ message: 'Passwords must be different' });

  try {
    // Update password
    await req.user.updateOne({ password: bcrypt.hashSync(newPassword, 6) });
    res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

const changeEmail = async (req, res, next) => {
  const email = req.body.email;

  // Validate incoming data
  if (!regex.email.test(email))
    return res.status(400).json({ message: 'Validation failed for `email`' });

  try {
    // Check if given email is not a duplicate
    const exists =
      (await User.exists({ email })) || (await EmailChange.exists({ new: email }));
    if (exists) return res.status(409).json({ message: 'User already exists' });

    // Create email change token
    await EmailChange.deleteOne({ user: req.user.id }); // Remove token if exists
    const change = await new EmailChange({ user: req.user.id, new: email }).save();

    // Send confirmation email
    const rendered = await prepareEmailChangeEmail(change.id);
    const mail = { from: process.env.SMTP_EMAIL, to: email, ...rendered };

    await transporter.sendMail(mail);

    res.status(200).json({ message: 'Email has been sent' });
  } catch (error) {
    next(error);
  }
};

const confirmEmailChange = async (req, res, next) => {
  const password = req.body.password;
  const token = req.query.token;

  // Check if given token is valid
  if (!token || !mongoose.isValidObjectId(token))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    const request = await EmailChange.findById(token).populate('user');
    if (!request) return res.status(404).json({ message: 'Not Found' });

    // Check password
    const user = request.user;
    if (!user.isPasswordCorrect(password))
      return res.status(401).json({ message: 'Incorrect password' });

    // Check if given email is not a duplicate
    const exists = await User.exists({ email: request.new });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    // Update email
    await user.updateOne({ email: request.new });

    res.status(200).json({ message: 'Email updated' });
  } catch (error) {
    next(error);
  }
};

/**
 * Sends account delete confirmation email
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const deleteAccount = async (req, res, next) => {
  const password = req.body.password;

  if (!password || !req.user.isPasswordCorrect(password))
    return res.status(401).json({ message: 'Incorrect password' });

  try {
    // Save a delete request token
    await Delete.deleteOne({ user: req.user.id }); // Remove token if exists
    const saved = await new Delete({ user: req.user.id }).save();

    // Prepare and send an email message
    const rendered = await prepareAccountDeleteEmail(saved.id);
    const mail = { from: process.env.SMTP_EMAIL, to: req.user.email, ...rendered };

    await transporter.sendMail(mail);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  assignTicket,
  getTrip,
  updateTrip,
  changePassword,
  changeEmail,
  confirmEmailChange,
  deleteAccount,
};
