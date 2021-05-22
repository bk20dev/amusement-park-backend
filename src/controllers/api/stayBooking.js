const defaultReducer = require('../../helpers/mongoReducer');
const transporter = require('../../connection/mail');
const StayBooking = require('../../models/stayBooking');
const accommodation = require('../../emails/generators/booking/accommodations');

const createStayBooking = async (req, res, next) => {
  const document = new StayBooking(req.body);

  // Validate document
  const validation = document.validateSync();
  if (validation?.errors) {
    const fields = Object.keys(validation.errors);
    const message = `Validation failed for \`${fields.join('`, `')}\``;
    return res.status(400).json({ message });
  }

  try {
    // Save the document
    const saved = await document.save();

    // Prepare and send a booking summary
    const rendered = await accommodation(saved.id, saved.code);
    const mail = { from: process.env.SMTP_EMAIL, to: saved.email, ...rendered };

    await transporter.sendMail(mail);

    res.status(201).json({
      message: 'Document created',
      document: defaultReducer(saved),
    });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000)
      return res.status(409).json({ message: 'This document already exists' });
    next(error);
  }
};

module.exports = createStayBooking;
