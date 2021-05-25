const mongoose = require('mongoose');
const Delete = require('../../models/delete');
const TicketBooking = require('../../models/ticketBooking');
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
    await User.deleteOne({ _id: request.user });

    // Unlink tickets
    await TicketBooking.updateMany({ user: request.user }, { $unset: { user: 1 } });

    // Remove token
    await Delete.deleteOne();

    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteAccount;
