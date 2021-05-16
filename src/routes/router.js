const express = require('express');
const only = require('../middleware/secured');

// Initialize routers
const auth = express.Router();
const api = express.Router();

// Auth
const signin = require('../controllers/auth/signin');
const signup = require('../controllers/auth/signup');
const recover = require('../controllers/auth/recover');

auth.post('/signup', only.signedOut, signup.signup);
auth.post('/verification', only.signedOut, signup.verify);
auth.post('/signin', only.signedOut, signin.signin);
auth.get('/signout', only.signedIn, signin.signout);
auth.get('/reset', recover.sendEmail);
auth.post('/reset', recover.resetPassword);

// API
const account = require('./api/account');
const map = require('./api/map');
const offer = require('./api/offer');
const booking = require('./api/booking');
const accommodation = require('./api/accommodation');
const restaurant = require('./api/restaurant');

api.use('/account', account);
api.use('/map', map);
api.use('/offer', offer);
api.use('/booking', booking);
api.use('/accommodation', accommodation);
api.use('/restaurant', restaurant);

module.exports = { auth, api };
