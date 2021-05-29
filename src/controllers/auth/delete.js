const mongoose = require('mongoose');
const Delete = require('../../models/delete');
const User = require('../../models/user');

const deleteAccount = async (req, res, next) => {
  const token = req.query.token;

  // Check if given token is valid
  if (!token || !mongoose.isValidObjectId(token))
    return res.status(400).json({ message: 'Invalid ObjectId' });

  try {
    // Check if token exists
    const request = await Delete.findById(token);
    if (!request) return res.status(404).json({ message: 'Not Found' });

    // Remove user account
    const user = await User.findOne({ _id: request.user });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    await request.deleteOne(); // Also remove account delete token

    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteAccount;
