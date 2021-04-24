const passport = require('passport');

// Import strategies
const signup = require('./signup');

// Initialize strategies
passport.use('signup', signup);
