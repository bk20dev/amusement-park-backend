const ejs = require('ejs');
const path = require('path');

/**
 * Generates base email with given template as its child
 * @param {String} title Email title
 * @param {String} templateName Name of the template
 * @param {Object} options Options passed to the template
 * @param  {...String} styles Stylesheets names
 * @returns
 */
const renderEmail = async (title, templateName, options, ...styles) => {
  const template = path.join(__dirname, `../templates/${templateName}.ejs`);
  const content = await ejs.renderFile(template, { title, ...options });

  const logo = `${process.env.BASE_URL}/static/logo.svg`;
  const base = path.join(__dirname, '../templates/base.ejs');

  const stylesheets = ['base', ...styles].map((name) => `../styles/${name}.css`);
  const rendered = await ejs.renderFile(base, { title, stylesheets, logo, content });
  return rendered;
};

module.exports = renderEmail;
