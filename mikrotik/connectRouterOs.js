require('dotenv').config()
const RouterOSAPI = require('node-routeros').RouterOSAPI;
function getRouterConnection() {
    return  new RouterOSAPI({
        host: process.env.MIKROTIK_HOST,
        user: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASSWORD,
        port: process.env.MIKROTIK_PORT,
        
    });
}

module.exports = getRouterConnection;