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

function post(endpoint, body, callback) {
    // Request
    const request = net.request({
        method: 'POST',
        protocol: hostProtocol,
        hostname: hostApi,
        // port:'80',
        path: endpoint,
    });

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            callback(chunk);
        });
    });
    request.setHeader('Content-Type', 'application/json');
    request.write(body, 'utf-8');
    request.end();
}

module.exports = {
    get,
    post,
}