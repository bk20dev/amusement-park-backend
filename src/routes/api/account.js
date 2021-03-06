const router = require('express').Router();
const {
  getTickets,
  assignTicket,
  getTrip,
  updateTrip,
  changePassword,
  changeEmail,
  deleteAccount,
} = require('../../controllers/api/account');

// Tickets
router.get('/tickets', getTickets);
router.post('/tickets/:id', assignTicket);

// Trip planning
router.get('/trip', getTrip);
router.put('/trip', updateTrip);

// Settings
router.put('/password', changePassword);
router.put('/email', changeEmail);
router.delete('/', deleteAccount);

module.exports = router;
