const { net } = require('electron');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public'
const hostProtocol = 'http:'

function get(endpoint, callback) {
    const valueRequest = {
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        path: endpoint,
    }

    const request = net.request(valueRequest)

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            try {
                callback(chunk)
            } catch (e) {
                console.log(e);
            }
        })
    })

    request.setHeader('Content-Type', 'application/json');
    request.end()
}

module.exports = {
    get,
}