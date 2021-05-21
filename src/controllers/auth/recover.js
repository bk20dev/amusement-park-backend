const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const regex = require('../../helpers/regex');
const transporter = require('../../connection/mail');
const recover = require('../../emails/generators/account/recover');
const User = require('../../models/user');
const Reset = require('../../models/reset');

/**
 * Sends a password reset email
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const sendEmail = async (req, res, next) => {
  const email = req.body.email;

  // Check if given email is valid
  if (!regex.email.test(email))
    return res.status(400).json({ message: 'Validation failed for `email`' });

  // Send response without checking if given email exists
  res.status(200).send({ message: 'Password reset email has been sent' });

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return;

    // Remove existing token
    await Reset.deleteOne({ user: user.id });

    // Save new password reset token
    const saved = await new Reset({ user: user.id }).save();

    // Prepare and send an email message
    const rendered = await recover(saved.id);
    const mail = { from: process.env.SMTP_EMAIL, to: email, ...rendered };

    await transporter.sendMail(mail);
  } catch (error) {
    next(error);
  }
};

/**
 * Changes user's password
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const resetPassword = async (req, res, next) => {
  const token = req.query.token;

  // Validate given id
  if (!token || !mongoose.isValidObjectId(token))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    const reset = await Reset.findById(token);

    // Check if a given token exists
    if (!reset)
      return res.status(404).json({ message: 'Password reset token not found' });

    // Validate new password
    const password = req.body.password;
    if (!regex.password.test(password))
      return res.status(400).json({ message: 'Validation failed for `password`' });

    // Update password and remove token
    const updated = await User.updateOne(
      { _id: reset.user },
      { password: bcrypt.hashSync(password, 6) }
    );
    await reset.delete();

    if (updated.n === 0) res.status(404).json({ message: 'User not found' });
    else res.status(200).json({ message: 'Password updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendEmail, resetPassword };
