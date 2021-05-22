const express = require('express');
const mongoose = require('mongoose');
const regex = require('../../helpers/regex');
const transporter = require('../../connection/mail');
const create = require('../../emails/generators/account/create');
const User = require('../../models/user');
const Verification = require('../../models/verification');

/**
 * Signs up a user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signup = async (req, res, next) => {
  const email = req.body.email;

  // Check if given email is valid
  if (!regex.email.test(email))
    return res.status(400).json({ message: 'Validation failed for `email`' });

  try {
    // Check if given email doesn't duplicate any existing account
    const accountExists = await User.exists({ email });
    if (accountExists) return res.status(409).json({ message: 'User already exists' });
  } catch (error) {
    return next(error);
  }

  let id;

  // Get id from existing token or create a new one
  try {
    const existingToken = await Verification.findOne({ email });

    if (existingToken) {
      id = existingToken.id;
    } else {
      // If the token does not exist, create a new one
      const verification = new Verification({ email });
      await verification.save();

      id = verification.id;
    }
  } catch (error) {
    return next(error);
  }

  res.status(201).json({ message: 'Account created' });

  // Prepare and send an email message
  const rendered = await create(id);
  const mail = { from: process.env.SMTP_EMAIL, to: email, ...rendered };

  await transporter.sendMail(mail);
};

/**
 * Confirms account creation
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const verify = async (req, res, next) => {
  const token = req.query.token;
  const password = req.body.password;

  try {
    // Check if token is valid
    if (!token || !mongoose.isValidObjectId(token)) {
      return res.status(400).json({ message: 'Invalid ObjectId' });
    }

    // Check if token exists
    const verification = await Verification.findById(token);

    if (!verification) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Check if given password is valid
    if (!regex.password.test(password)) {
      return res.status(400).json({ message: 'Validation failed for `password`' });
    }

    // Create user account
    const user = new User({ email: verification.email, password });
    await user.save();

    // Delete verification document
    await verification.deleteOne();

    res.status(201).json({ message: 'Account created' });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, verify };
