const express = require('express');
const passport = require('passport');

/**
 * Signs in a user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signin = (req, res, next) => {
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
const signout = (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Signed out' });
};

module.exports = { signin, signout };
