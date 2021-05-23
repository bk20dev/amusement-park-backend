const renderEmail = require('../base');

const deleteAccount = async (token) => {
  const subject = 'Account deletion';
  const link = process.env.ACCOUNT_DELETE_URI + '?token=' + token;

  const html = await renderEmail(subject, 'account/delete', { link }, 'confirm');
  const text = `Hello there!\nWe are really sorry, you want to delete your account. Remember that all your tickets will be unlinked from your account and personalized content will be removed. In order to confirm your account open the below link.\n${link}\n\nNote: If you did not request account deletion, somebody may have access to your account. If that's the case, change password as fast as possible and make sure that no changes were made\n\nBest regards,\nThe Pablo's Team`;

  return { subject, text, html };
};

module.exports = deleteAccount;
