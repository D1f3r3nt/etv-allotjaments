const { net } = require('electron');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public';
const hostProtocol = 'http:';

function get(endpoint, callback) {
    const valueRequest = {
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        path: endpoint,
    };

    const request = net.request(valueRequest);

    request.on('response', (response) => {
        data = [];
        response.on('data', (chunk) => {
            data.push(chunk);
        });
        response.on('end', () => {
            callback(data.join(" "));
        });
    });

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
        data = [];
        response.on('data', (chunk) => {
            data.push(chunk);
        });
        response.on('end', () => {
            callback(data.join(" "));
        });
    });
    request.setHeader('Content-Type', 'application/json');
    request.write(body, 'utf-8');
    request.end();
}

function getWithToken(endpoint, body, token, callback) {
    // Request
    const request = net.request({
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        path: endpoint,
    });

    request.on('response', (response) => {
        data = [];
        response.on('data', (chunk) => {
            data.push(chunk);
        });
        response.on('end', () => {
            callback(data.join(" "));
        });
    });

    request.setHeader('Content-Type', 'application/json');
    request.setHeader('Authorization', token);
    request.write(body, 'utf-8');
    request.end();
}

function postWithToken(endpoint, body, token, callback) {
    // Request
    const request = net.request({
        method: 'POST',
        protocol: hostProtocol,
        hostname: hostApi,
        path: endpoint,
    });

    request.on('response', (response) => {
        data = [];
        console.log(response);
        response.on('data', (chunk) => {
            data.push(chunk);
        });
        response.on('end', () => {
            callback(data.join(" "));
        });
    });

    request.setHeader('Content-Type', 'application/json');
    request.setHeader('Authorization', token);
    request.write(body, 'utf-8');
    request.end();
}

module.exports = {
    get,
    post,
    postWithToken,
    getWithToken,
};