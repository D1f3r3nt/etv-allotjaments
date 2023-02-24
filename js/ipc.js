const { net, ipcMain, BrowserWindow, Menu } = require('electron');
const { myMenuLogged } = require('../components/menu_logged');
const { get, post, postWithToken } = require('./crud');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public';
const hostProtocol = 'http:';
let current_window;

//Variable token
let token;
let userId;

function init(win) {
    current_window = win;
}

// ========================
// Close a page
// ========================
ipcMain.on('close_window', (e, args) => {

    const login = BrowserWindow.fromWebContents(e.sender);
    login.close();

});

// ========================
// GET all Allotjaments
// ========================
ipcMain.on('get_allotjaments', (e, args) => {
    get('/api/allotjaments', (chunk) => {
        e.sender.send('res_get_allotjaments', JSON.parse(chunk));
    });
});

// ========================
// GET all Fotos
// ========================
ipcMain.on('get_fotos', (e, args) => {
    get('/api/fotos', (chunk) => {
        e.sender.send('res_get_fotos', JSON.parse(chunk))
    });
});

// ========================
// POST Login
// ========================
ipcMain.on('post_login', (e, args) => {

    //Variables
    var body = JSON.stringify(args);

    post('/api/login', body, (chunk) => {
        responseData = JSON.parse(chunk);
        e.sender.send('res_post_login', responseData);

        // Guardam Credencials si hi ha Login
        if (responseData.status === "success") {
            // Guardar Token
            token = 'Bearer ' + responseData.data.token;
            // Guardar Usuari
            userId = responseData.data.usuari.id;
            // Enviar Info a la finestra principal
            // win.webContents.send('res_post_login', responseData);

            //Canviar Menu
            Menu.setApplicationMenu(myMenuLogged(current_window));
        }
    });
});

// ========================
// POST Allotjament
// ========================
ipcMain.on('post_allotjament', (e, args) => {

    //Variables
    var body = JSON.stringify(args);
    console.log(body);

    postWithToken('/api/allotjaments', body, token,(chunk) => {
        responseData = JSON.parse(chunk);
        console.log(responseData);
        e.sender.send('res_post_allotjament', responseData);
    });
});

// ========================
// GET Municipis
// ========================
ipcMain.on('get_municipis', (e, args) => {

    // Request
    const request = net.request({
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        // port:'80',
        path: '/api/municipis',
    });

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            e.sender.send('res_get_municipis', JSON.parse(chunk));
            console.log(response);
        });
    });

    request.setHeader('Content-Type', 'application/json');
    request.end();
});


// ========================
// GET Comentaris Per Id
// ========================
ipcMain.on('get_comentaris_id', (e, args) => {

    // Request
    const request = net.request({
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        // port:'80',
        path:`/api/comentaris/${args}`,
    });

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            e.sender.send('res_get_comentaris_id', JSON.parse(chunk));
            console.log(response);
        });
    });

    request.setHeader('Content-Type', 'application/json');
    request.end();
});

// ========================
// Log Out
// ========================
function logout() {
    console.log("token at START: " + token);

    //Crida API LogOut
    // Request
    const request = net.request({
        method: 'GET',
        protocol: hostProtocol,
        hostname: hostApi,
        // port:'80',
        path: '/api/logout',
    });

    request.on('response', (response) => {
        response.on('data', (chunk) => {
            console.log("RESPONSE");
            console.log(response);
            console.log("JSON CHUNK");
            console.log(JSON.parse(chunk));

        });
    });

    request.setHeader('Content-Type', 'application/json');
    request.setHeader('Authorization', token);
    request.write("", 'utf-8');
    request.end();

    // Buidar Variables
    token = '';
    userId = '';
}

// ========================
// Carga pagina de detalles
// ========================
ipcMain.on('load_page_detalls', (e, id) => {
    current_window.loadFile('./pages/detalls.html');

    get(`/api/allotjaments/${id}`, (chunk) => {
        e.sender.send('res_load_data', JSON.parse(chunk))
    });
});

// ========================
// Cargar pagina principal
// ========================
ipcMain.on('load_home_page', () => {
    current_window.loadFile('./pages/index.html')
});


module.exports = {
    logout,
    init
};

