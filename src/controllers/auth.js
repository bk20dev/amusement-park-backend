const express = require('express');
const passport = require('passport');

/**
 * Signs up a user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signup = (req, res, next) => {
  // If the user is already signed in, prevent them from signing up
  if (req.isAuthenticated())
    return res.status(403).json({ message: 'User is already signed in' });

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

module.exports = { signup };
