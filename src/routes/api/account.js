const router = require('express').Router();
const only = require('../../middleware/secured');
const { getTickets, assignTicket } = require('../../controllers/api/account');

// Tickets
router.get('/tickets', only.signedIn, getTickets);
router.post('/tickets/:id', only.signedIn, assignTicket);

module.exports = router;
