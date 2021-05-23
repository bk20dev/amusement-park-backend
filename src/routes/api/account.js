const router = require('express').Router();
const only = require('../../middleware/secured');
const {
  getTickets,
  assignTicket,
  getTrip,
  updateTrip,
  changePassword,
} = require('../../controllers/api/account');

// Tickets
router.get('/tickets', getTickets);
router.post('/tickets/:id', assignTicket);

// Trip planning
router.get('/trip', getTrip);
router.put('/trip', updateTrip);

// Settings
router.put('/password', changePassword);

module.exports = router;
