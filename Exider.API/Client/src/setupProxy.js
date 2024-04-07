const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

// const target = env.ASPNETCORE_HTTPS_PORT ? `http://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:54040';

const target = `http://localhost:5000`;

const context = [
    "/accounts",
    "/authentication",
    "/confirmations",
    "/password-recovery",
    "/storage",
    "/file",
    "/folders"
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
