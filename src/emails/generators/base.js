const path = require('path');
const ejs = require('ejs');

const generateEmailBase = async (title, content, ...styles) => {
  const logo = `${process.env.BASE_URL}/static/logo.svg`;
  const file = path.join(__dirname, '../templates/base.ejs');

  const options = { logo, title, content, styles };

  const rendered = await ejs.renderFile(file, options);
  return rendered;
};

module.exports = generateEmailBase;
