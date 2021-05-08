const path = require('path');
const ejs = require('ejs');

const composeEmail = async (title, content) => {
  const logo = `${process.env.BASE_URL}/static/logo.svg`;
  const file = path.join(__dirname, '../emails/templates/base.ejs');

  const options = { logo, title, content };

  const rendered = await ejs.renderFile(file, options);
  return rendered;
};

module.exports = composeEmail;
