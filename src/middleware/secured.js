const express = require('express');

/**
 * Checks if the user is signed in. If they are not, error response is send
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not signed in' });
};

/**
 * Checks if the user is signed out. If they are not, error response is send
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signedOut = (req, res, next) => {
  if (req.isUnauthenticated()) return next();
  res.status(401).json({ message: 'Already signed in' });
};

module.exports = { signedIn, signedOut };
