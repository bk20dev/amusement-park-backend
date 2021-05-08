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
  favourites: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 6);
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const user = mongoose.model('users', userSchema);

module.exports = user;
