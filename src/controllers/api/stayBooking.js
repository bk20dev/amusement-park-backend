const defaultReducer = require('../../helpers/mongoReducer');
const transporter = require('../../connection/mail');
const generateConfirmEmail = require('../../emails/generators/confirm');
const StayBooking = require('../../models/stayBooking');

const createStayBooking = async (req, res, next) => {
  const document = new StayBooking(req.body);

  // Validate document
  const validation = document.validateSync();
  if (validation?.errors) {
    const fields = Object.keys(validation.errors);
    const message = `Validation failed for \`${fields.join('`, `')}\``;
    return res.status(400).json({ message });
  }

  // Save the document
  try {
    const saved = await document.save();

    // Prepare and send a booking summary
    const link = process.env.STAY_BOOKING_SUMMARY_URI + '?id=' + saved.id;

    const title = 'Accommodation booking';
    const content = `Hello there! Thank you for placing accommodation booking in Pablo's. Your security code is <strong>${saved.code}</strong><br />Click the below button to see details.`;
    const action = 'Booking details';
    const raw = `Hello there! Thank you for placing accommodation booking in Pablo's. Your security code is ${saved.code}.\nOpen the below link to to see details.\n${link}\n\nBest regards,\nThe Pablo's Team`;

    const options = {
      from: process.env.SMTP_EMAIL,
      to: saved.email,
      subject: title,
      text: raw,
      html: await generateConfirmEmail({ title, content, action, link }),
    };

    await transporter.sendMail(options);

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
