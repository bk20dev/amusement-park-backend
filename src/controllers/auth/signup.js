const express = require('express');
const mongoose = require('mongoose');
const regex = require('../../helpers/regex');
const transporter = require('../../connection/mail');
const generateConfirmEmail = require('../../emails/generators/confirm');
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
  const link = process.env.ACCOUNT_CONFIRMATION_URL + '?token=' + id;

  const title = "Confirm your Pablo's Account";
  const content =
    "Hello there! Thank you for creating Pablo's Account!<br />Click the below button to confirm your email and set a password.";
  const disclaimer = 'If you did not sign up for this account, you can ignore this email';
  const action = 'Confirm email address';
  const raw = `Hello there!\nThank you for creating Pablo's Account!\nOpen the below link to confirm your email and set a password.\n${link}\n\nNote: If you did not sign up for this account, you can ignore this email\n\nBest regards,\nThe Pablo's Team`;

  const options = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: title,
    text: raw,
    html: await generateConfirmEmail({ title, content, disclaimer, action, link }),
  };

  transporter.sendMail(options);
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
