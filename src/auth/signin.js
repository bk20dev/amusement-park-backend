const LocalStrategy = require('passport-local');
const User = require('../models/user');

/** Sign in strategy */
const signin = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      // Find user in the database
      const user = await User.findOne({ email });
      const correct = user?.isPasswordCorrect(password);

      // If the user is found
      if (correct) return done(null, user);

      // If the user is not found
      return done(null, false, { message: 'User not found', notFound: true });
    } catch (error) {
      done(error);
    }
  }
);

module.exports = signin;
