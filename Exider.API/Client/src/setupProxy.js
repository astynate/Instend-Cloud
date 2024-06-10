const { createProxyMiddleware } = require('http-proxy-middleware');

const target = `https://70bb-46-56-162-237.ngrok-free.app`;

const context = [
    "/accounts",
    "/authentication",
    "/confirmations",
    "/password-recovery",
    "/storage",
    "/file",
    "/folders",
    "/access",
    "/api",
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