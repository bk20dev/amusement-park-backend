const renderEmail = require('../base');

const changeEmail = async (token) => {
  const subject = 'Email change';
  const link = process.env.EMAIL_CHANGE_URL + '?token=' + token;

  const html = await renderEmail(subject, 'account/changeEmail', { link }, 'confirm');
  const text = `Hello there!\nOpen the below link to confirm your email address.\n${link}\n\nNote: If that was not you, please ignore this email and do not open the link in your browser\n\nBest regards,\nThe Pablo's Team`;

  return { subject, text, html };
};

module.exports = changeEmail;
