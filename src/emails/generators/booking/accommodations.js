const qrcode = require('qrcode');
const renderEmail = require('../base');

const accommodation = async (token, code) => {
  const subject = 'Accommodation booking';
  const link = process.env.STAY_BOOKING_SUMMARY_URI + '?token=' + token;
  const image = await qrcode.toDataURL(link);
  const options = { image, token, code, link };

  const html = await renderEmail(subject, 'booking/accommodations', options, 'confirm');
  const text = `Hello there! Thank you for placing accommodation booking in Pablo's. Your security code is ${code}.\nOpen the below link to to see details.\n${link}\n\nBest regards,\nThe Pablo's Team`;

  return { subject, text, html };
};

module.exports = accommodation;
