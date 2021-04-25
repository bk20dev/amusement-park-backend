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

/**
 * Signs in a user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signin = (req, res, next) => {
  // If the user is already signed in, prevent them from signing up
  if (req.isAuthenticated())
    return res.status(403).json({ message: 'User is already signed in' });

  // Login the user
  passport.authenticate('signin', (error, user, info) => {
    // If there is a server error, pass it to the next middleware
    if (error) return next(error);

    // Login the user
    if (user)
      return req.login(user, (error) => {
        if (error) next(error);
        else res.status(200).json({ message: 'Logged in' });
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
 * @param {express.NextFunction} next
 */
const signout = (req, res) => {
  // If the user is already signed in, prevent them from signing up
  if (req.isUnauthenticated())
    return res.status(403).json({ message: 'User is not signed in' });

  // Sign out the user
  req.logout();
  res.status(200).json({ message: 'Signed out' });
};

module.exports = { signup, signin, signout };
