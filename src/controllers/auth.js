const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const regex = require('../validation/regex');
const transporter = require('../connection/mail');
const User = require('../models/user');
const Verification = require('../models/verification');
const Reset = require('../models/reset');

class AuthController {
  /**
   * Signs up a user
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static signup = async (req, res, next) => {
    const email = req.body.email;

    // Check if given email is valid
    if (!regex.email.test(email))
      return res.status(400).json({ message: 'Validation failed for `email`' });

    try {
      // Check if given email is not a duplicate
      // prettier-ignore
      const duplicate = await User.exists({ email }) || await Verification.exists({ email });
      if (duplicate) return res.status(409).json({ message: 'User already exists' });
    } catch (error) {
      return next(error);
    }

    // If the user does not exist, create verification account
    const verifiaction = new Verification({ email });

    try {
      // Save the account
      await verifiaction.save();
    } catch (error) {
      return next(error);
    }

    // Prepare an email message
    const link = process.env.ACCOUNT_CONFIRMATION_LINK + '?token=' + verifiaction.id;
    const message = `Hello there,\nThank you for creating Pablo's Account!\nClick the below link to confirm your email and set a password.\n${link}\n\nNote: If you did not sign up for this account, you can ignore this email\n\nBest regards,\nThe Pablo's Team`;

    const options = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Confirm your Pablo's Account",
      text: message,
    };

    try {
      // Send the email message
      await transporter.sendMail(options);
    } catch {
      return next(error);
    }

    res.status(201).json({ message: 'Account created' });
  };

  /**
   * Confirms account creation
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static verification = async (req, res, next) => {
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

  /**
   * Signs in a user
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static signin = (req, res, next) => {
    // Sign in the user
    passport.authenticate('signin', (error, user, info) => {
      // If there is a server error, pass it to the next middleware
      if (error) return next(error);

      // Sign in the user
      if (user)
        return req.login(user, (error) => {
          if (error) next(error);
          else res.status(200).json({ message: 'Signed in' });
        });

      // If the user has not been found or credentials are missing
      const status = info.notFound ? 404 : 400;
      const message = info.message;

      res.status(status).json({ message });
    })(req, res, next);
  };

  /**
   * Signs out a user
   * @param {express.Request} req
   * @param {express.Response} res
   */
  static signout = (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Signed out' });
  };

  /**
   * Sends a password reset email
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static sendPasswordResetEmail = async (req, res, next) => {
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

      // Compose and send an email
      const link = process.env.PASSWORD_RESET_LINK + '?id=' + saved.id;
      const options = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Password reset',
        text: `Hello there!\nTo reset your Pablo's Account password open the following link. If you didin\'t issue a password reset, you can ignore this email.\n${link}`,
      };

      await transporter.sendMail(options);
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
  static resetPassword = async (req, res, next) => {
    const token = req.body.token;

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
}

module.exports = AuthController;
