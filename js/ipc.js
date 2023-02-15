const { net, ipcMain, BrowserWindow, Menu } = require('electron');
const { myMenuLogged } = require('../components/menu_logged');
const { get } = require('./crud');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public'
const hostProtocol = 'http:'
let current_window;

//Variable token
let token;
let userId;


exports.init = function (win) {
  current_window = win;
}

// Close
ipcMain.on('close_window', (e, args) => {

  const login = BrowserWindow.fromWebContents(e.sender);
  login.close();

})

// GET all Allotjaments
ipcMain.on('get_allotjaments', (e, args) => {
  get('/api/allotjaments', (chunk) => {
    e.sender.send('res_get_allotjaments', JSON.parse(chunk))
  });
})

// GET all Fotos
ipcMain.on('get_fotos', (e, args) => {
  get('/api/fotos', (chunk) => {
    e.sender.send('res_get_fotos', JSON.parse(chunk))
  });
})

// POST Login
ipcMain.on('post_login', (e, args) => {

  //Variables
  var body = JSON.stringify(args);

  // Request
  const request = net.request({
    method: 'POST',
    protocol: hostProtocol,
    hostname: hostApi,
    // port:'80',
    path: '/api/login',
  });

  request.on('response', (response) => {
    response.on('data', (chunk) => {

      responseData = JSON.parse(chunk);
      e.sender.send('res_post_login', responseData)

      // Guardam Credencials si hi ha Login
      if (responseData.status == "success") {
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
  request.setHeader('Content-Type', 'application/json');
  request.write(body, 'utf-8');
  request.end();
})

// GET Municipis
ipcMain.on('get_municipis', (e, args) => {

  //Variables
  var body = JSON.stringify(args);
  var statusCode

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
      e.sender.send('res_post_login', JSON.parse(chunk))
      console.log(response);
    });
  });

  request.setHeader('Content-Type', 'application/json');
  request.setHeader('Authorization', token);
  request.write(body, 'utf-8');
  request.end();
})

// Carga pagina de detalles
ipcMain.on('load_page_detalls', (e, id) => {
  current_window.loadFile('./pages/detalls.html');

  get(`/api/allotjaments/${id}`, (chunk) => {
    e.sender.send('res_load_data', JSON.parse(chunk))
  });
});

// Cargar pagina principal
ipcMain.on('load_home_page', () => {
  current_window.loadFile('./pages/index.html')
});