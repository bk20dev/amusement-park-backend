const express = require('express');

/**
 * Checks if the user is signed in
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not signed in' });
};

/**
 * Checks if the user is signed out
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signedOut = (req, res, next) => {
  if (req.isUnauthenticated()) return next();
  res.status(401).json({ message: 'Already signed in' });
};

/**
 * Checks if the user is admin
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user?.admin === true) return next();
  res.status(403).json({ message: 'Access denied' });
};

module.exports = { signedIn, signedOut, isAdmin };
