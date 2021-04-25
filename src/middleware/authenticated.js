/**
 * Checks if the user is authenticated. If they are not, error response is send
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Not signed in' });
};

module.exports = authenticated;
