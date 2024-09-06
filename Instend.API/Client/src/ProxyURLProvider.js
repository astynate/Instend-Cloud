// const fs = require('fs');
// const path = require('path');

// import json from '../../Properties/launchSettings.json';

class ProxyURLProvider {
    serverUrl = "http://localhost:5000adsfsdfdsf";
    // configPath = path.join(__dirname, '../../../Properties/launchSettings.json');
    profiles = {instendLocal: 'Instend-Local'};

    UpdateURL = (profile) => {
        // if (fs.existsSync(configPath)) {
        //     const configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        //     serverUrl = configuration['profiles'][profile]['applicationUrl'].split(';')[0];
        // } else {
        //     console.error('Configuration file not found:', configPath);
        //     serverUrl = 'http://localhost:5000';
        // }
        // console.log(json)
        console.log(process.env); 
    } 
}

let proxyURLProvider = new ProxyURLProvider(); proxyURLProvider.UpdateURL(proxyURLProvider.profiles.instendLocal);

export default proxyURLProvider;