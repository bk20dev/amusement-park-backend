const renderEmail = require('../base');

const recover = async (token) => {
  const subject = 'Password reset';
  const link = process.env.PASSWORD_RESET_URL + '?token=' + token;

  const html = await renderEmail(subject, 'account/recover', { link }, 'confirm');
  const text = `Hello there!\nOpen the below link to reset your password.\n${link}\n\nNote: If you did not issue a password reset, you can ignore this email\n\nBest regards,\nThe Pablo's Team`;

  return { subject, text, html };
};

module.exports = recover;
