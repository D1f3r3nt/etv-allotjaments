const { net, ipcMain, BrowserWindow, Menu } = require('electron');
const { myMenuLogged } = require('../components/menu_logged');
const { get, post } = require('./crud');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public'
const hostProtocol = 'http:'
let current_window;

//Variable token
let token;
let userId;

exports.init = function (win) {
  current_window = win;
}
// ========================
// Close a page
// ========================
ipcMain.on('close_window', (e, args) => {

  const login = BrowserWindow.fromWebContents(e.sender);
  login.close();

})

// ========================
// GET all Allotjaments
// ========================
ipcMain.on('get_allotjaments', (e, args) => {
  get('/api/allotjaments', (chunk) => {
    e.sender.send('res_get_allotjaments', JSON.parse(chunk))
  });
})

// ========================
// GET all Fotos
// ========================
ipcMain.on('get_fotos', (e, args) => {
  get('/api/fotos', (chunk) => {
    e.sender.send('res_get_fotos', JSON.parse(chunk))
  });
})

// ========================
// POST Login
// ========================
ipcMain.on('post_login', (e, args) => {

  //Variables
  var body = JSON.stringify(args);

  post('/api/login', body, (chunk) => {
    responseData = JSON.parse(chunk);
    e.sender.send('res_post_login', responseData)

    // Guardam Credencials si hi ha Login
    if (responseData.status == "success") {
      // Guardar Token
      token = 'Bearer ' + responseData.data.token;
      console.log(token)
      // Guardar Usuari
      userId = responseData.data.usuari.id;
      console.log(userId)
      // Enviar Info a la finestra principal
      // win.webContents.send('res_post_login', responseData);

      //Canviar Menu
      Menu.setApplicationMenu(myMenuLogged(current_window));
    }
  });
})

// ========================
// GET Municipis
// ========================
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

// ========================
// Log Out
// ========================
module.exports = { logout };
function logout() {
  console.log("token at START: " + token)

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
  token = ''
  userId = ''
  console.log("token at END: " + token)
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
