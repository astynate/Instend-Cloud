const { createProxyMiddleware } = require('http-proxy-middleware');

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../../Properties/launchSettings.json');
const profiles = {instendLocal: 'Instend-Local'};

const GetTargetURL = (profile) => {
    if (fs.existsSync(configPath)) {
        const configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return configuration['profiles'][profile]['applicationUrl'].split(';')[0];
    } else {
        console.error('Configuration file not found:', configPath);
        return 'http://localhost:5000';
    }
}

const target = GetTargetURL(profiles.instendLocal);

const context = [
    "/accounts",
    "/authentication",
    "/confirmations",
    "/password-recovery",
    "/storage",
    "/file",
    "/folders",
    "/access",
    "/api"
];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: target,
    onError: onError,
    ws: true,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    },
  });

  app.use(appProxy);
};