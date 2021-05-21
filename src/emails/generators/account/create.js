const renderEmail = require('../base');

const create = async (token) => {
  const subject = "Confirm your Pablo's Account";
  const link = process.env.ACCOUNT_CONFIRMATION_URL + '?token=' + token;

  const html = await renderEmail(subject, 'account/create', { link }, 'confirm');
  const text = `Hello there!\nThank you for creating Pablo's Account!\nOpen the below link to confirm your email and set a password.\n${link}\n\nNote: If you did not sign up for this account, you can ignore this email\n\nBest regards,\nThe Pablo's Team`;

  return { subject, text, html };
};

module.exports = create;
