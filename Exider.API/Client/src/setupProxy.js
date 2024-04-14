const { createProxyMiddleware } = require('http-proxy-middleware');

const target = `http://localhost:5000`;

const context = [
    "/accounts",
    "/authentication",
    "/confirmations",
    "/password-recovery",
    "/storage",
    "/file",
    "/folders",
    "/access"
];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: target,
    onError: onError,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  });

  app.use(appProxy);
};