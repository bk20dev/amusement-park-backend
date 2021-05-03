const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const regex = require('../validation/regex');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: { validator: (value) => regex.email.test(value) },
  },
  password: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.password.test(value) },
  },
  name: {
    type: String,
    required: true,
    validate: { validator: (value) => regex.name.test(value) },
  },
});

const hash = (text) => bcrypt.hashSync(text, 6);

userSchema.pre('save', function (next) {
  this.password = hash(this.password);
  next();
});

userSchema.pre('updateOne', function (next) {
  const password = hash(this.getUpdate().password);
  this.update({ password });
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model('users', userSchema);

module.exports = user;
