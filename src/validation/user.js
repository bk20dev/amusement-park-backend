const regex = require('./regex');
const User = require('../models/user');

/**
 * Validates user data
 * @param {string} email Email
 * @param {string} password Password
 * @param {string} name User first name
 * @returns Message with validation errors
 */
const validate = async (email, password, name) => {
  const messages = [];

  // Check if given email is already taken
  if (regex.email.test(email)) {
    const exists = await User.exists({ email });
    if (exists) messages.push('Email is already taken.');
  }

  // Validate user
  const user = new User({ email, password, name });

  const validation = user.validateSync();
  const fields = validation ? Object.keys(validation.errors) : [];

  if (fields.length) {
    // Create validation error message
    const message = `Validation failed for \`${fields.join('`, `')}\`.`;
    messages.push(message);
  }

  return messages.join(' ');
};

module.exports = validate;
