const LocalStrategy = require('passport-local');
const User = require('../models/user');
const validate = require('../validation/user');

/** Signup strategy */
const signup = new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    const name = req.body.name;

    // Validate incomming data
    const message = await validate(email, password, name);
    if (message.length) return done(null, false, { message });

    try {
      // Save the user
      const user = await new User({ email, password, name }).save();
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = signup;
