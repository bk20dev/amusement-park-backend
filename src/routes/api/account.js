const router = require('express').Router();
const only = require('../../middleware/secured');
const {
  getTickets,
  assignTicket,
  getTrip,
  updateTrip,
} = require('../../controllers/api/account');

// Tickets
router.get('/tickets', only.signedIn, getTickets);
router.post('/tickets/:id', only.signedIn, assignTicket);

// Trip planning
router.get('/trip', only.signedIn, getTrip);
router.put('/trip', only.signedIn, updateTrip);

module.exports = router;
