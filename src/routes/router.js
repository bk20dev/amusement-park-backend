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
const map = require('./api/map');
const offer = require('./api/offer');

api.use('/map', map);
api.use('/offer', offer);

module.exports = { auth, api };
