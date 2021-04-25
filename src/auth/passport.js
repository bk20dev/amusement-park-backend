const passport = require('passport');
const User = require('../models/user');

// Import strategies
const signup = require('./signup');
const signin = require('./signin');

// Initialize strategies
passport.use('signup', signup);
passport.use('signin', signin);

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
