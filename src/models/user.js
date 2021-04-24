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

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, 6);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compareSync(password, this.password);
};

const user = mongoose.model('users', userSchema);

module.exports = user;
