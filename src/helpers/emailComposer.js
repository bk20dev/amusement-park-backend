const composeEmail = (content) => {
  // prettier-ignore
  // Email template
  const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>*{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;margin:0}body{font-family:'Montserrat',sans-serif;font-size:18px}.container{max-width:800px;background:#fdfdfd;margin:0 auto;min-height:300px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:64px;text-align:center}.logo{height:24px}.content{padding:64px;background:#fff;margin:64px 0;width:100%}h1{margin-bottom:48px;font-weight:500;font-size:48px}p{margin-bottom:16px;font-size:18px;line-height:1.6em}p.muted{opacity:0.5;font-size:0.8em}a.button{-webkit-appearance:button;-moz-appearance:button;appearance:button;border:none;font-size:inherit;text-decoration:none}a.button.big{margin-top:32px;padding:16px 32px;border-radius:64px;background:#df19ff;color:#fff;font-weight:500}footer .copyright{font-size:0.8em;opacity:0.25}</style></head><body><div class="container"> <img class="logo" src="${process.env.BASE_URL}/static/logo.svg" alt="logo"/><div class="content">${content}</div><footer><p class="copyright">Copyright &copy; ${new Date().getFullYear()} Pablo’s Entertainment Factory</p></footer></div></body></html>`;

  return template;
};

module.exports = composeEmail;
