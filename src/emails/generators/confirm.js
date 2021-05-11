const ejs = require('ejs');
const path = require('path');
const generateEmailBase = require('./base');

const generateConfirmEmail = async ({ title, content, disclaimer, action, link }) => {
  const file = path.join(__dirname, '../templates/confirm.ejs');
  const options = { title, content, disclaimer, action, link };

  const partial = await ejs.renderFile(file, options);
  const rendered = await generateEmailBase(title, partial, 'confirm.css');

  return rendered;
};

module.exports = generateConfirmEmail;
