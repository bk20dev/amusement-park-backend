const express = require('express');
const only = require('../middleware/secured');

// Initialize routers
const auth = express.Router();
const api = express.Router();

// Auth
const signin = require('../controllers/auth/signin');
const signup = require('../controllers/auth/signup');
const recover = require('../controllers/auth/recover');
const deleteAccount = require('../controllers/auth/delete');
const { confirmEmailChange } = require('../controllers/api/account');

auth.post('/signup', only.signedOut, signup.signup);
auth.post('/verification', only.signedOut, signup.verify);
auth.post('/signin', only.signedOut, signin.signin);
auth.get('/signout', only.signedIn, signin.signout);
auth.get('/reset', recover.sendEmail);
auth.post('/reset', recover.resetPassword);
auth.post('/delete', deleteAccount);
auth.post('/email', confirmEmailChange);

// API
const account = require('./api/account');
const map = require('./api/map');

api.use('/account', only.signedIn, account);
api.use('/map', map);

const ticketOffer = require('./api/ticketOffer');
const ticketBooking = require('./api/ticketBooking');
const stayOffer = require('./api/stayOffer');
const stayBooking = require('./api/stayBooking');
const restaurantOffer = require('./api/restaurantOffer');

api.use('/tickets/bookings', ticketBooking);
api.use('/tickets', ticketOffer);
api.use('/stay/bookings', stayBooking);
api.use('/stay', stayOffer);
api.use('/restaurant', restaurantOffer);

module.exports = { auth, api };
