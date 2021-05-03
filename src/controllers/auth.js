const express = require('express');
const passport = require('passport');
const regex = require('../validation/regex');
const transporter = require('../connection/mail');
const User = require('../models/user');
const Reset = require('../models/reset');

class AuthController {
  /**
   * Signs up a user
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static signup = (req, res, next) => {
    // If the user is already signed in, prevent them from signing up
    if (req.isAuthenticated())
      return res.status(403).json({ message: 'Already signed in' });

    // Register the user
    passport.authenticate('signup', { session: false }, (error, user, info) => {
      // If there is a server error, pass it to the next middleware
      if (error) return next(error);

      // If there is a user, send success message
      if (user) return res.status(201).json({ message: 'Signed up' });

      // If the user hasn't been signed up
      const message = info.message;
      res.status(400).json({ message });
    })(req, res, next);
  };

  /**
   * Signs in a user
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static signin = (req, res, next) => {
    // If the user is already signed in, prevent them from signing in
    if (req.isAuthenticated())
      return res.status(403).json({ message: 'Already signed in' });

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
    // If the user is not signed in, prevent them from signing out
    if (req.isUnauthenticated())
      return res.status(401).json({ message: 'Not signed in' });

    // Sign out the user
    req.logout();
    res.status(200).json({ message: 'Signed out' });
  };

  /**
   * Sends a password reset email
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  static reset = async (req, res, next) => {
    // If the user is already signed in, prevent them from reminding their password
    if (req.isAuthenticated())
      return res.status(403).json({ message: 'Already signed in' });

    const email = req.body.email;

    // Check if given email is valid
    if (!regex.email.test(email))
      return res.status(400).json({ message: 'Validation failed for `email`' });

    // Send response without checking if given email exists
    res.status(200).send({ message: 'A password reset email has been sent' });

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return;

      // Save new password reset token
      await Reset.deleteOne({ user: user.id }); // Remove existing token
      const saved = await new Reset({ user: user.id }).save();

      // Compose and send an email
      const link = process.env.PASSWORD_RESET_LINK + '/' + saved.id;
      const options = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'Password reset',
        text: `Hello ${user.name}!\nTo reset your Pablo's Entertainment Factory account password open the following link. If you didin\'t issue a password reset, you can safely ignore this email.\n${link}`,
        html: `<p>Hello ${user.name}!<br />To reset your password click on the folowing link.<br />If you didin\'t issue a password reset, you can safely ignore this email.</p><a href="${link}">${link}</a>`,
      };

      await transporter.sendMail(options);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
