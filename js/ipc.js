const { net, ipcMain, BrowserWindow } = require('electron')

//Variable token
let token;
let userId;
let hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public'
let hostProtocol = 'http:'

// Close
ipcMain.on('close_window', (e, args) => {

  const login = BrowserWindow.fromWebContents(e.sender);
  login.close();

})

// GET all Allotjaments
ipcMain.on('get_allotjaments', (e, args) => {
  const valueRequest = {
    method: 'GET',
    protocol: hostProtocol,
    hostname: hostApi,
    // port:'80',
    path: '/api/allotjaments',
  }

  const request = net.request(valueRequest)

  request.on('response', (response) => {
    response.on('data', (chunk) => {
      try {
        e.sender.send('res_get_allotjaments', JSON.parse(chunk))
        //console.log(`BODY: ${chunk}`)
      } catch (e) {
        console.log(e);
      }
    })
  })

  request.setHeader('Content-Type', 'application/json');
  request.end()
})

// GET all Fotos
ipcMain.on('get_fotos', (e, args) => {
  const valueRequest = {
    method: 'GET',
    protocol: hostProtocol,
    hostname: hostApi,
    // port:'80',
    path: '/api/fotos',
  }

  const request = net.request(valueRequest)

  request.on('response', (response) => {
    response.on('data', (chunk) => {
      try {
        e.sender.send('res_get_fotos', JSON.parse(chunk))
        //console.log(`BODY: ${chunk}`)
      } catch (e) {
        console.log(e);
      }
    })
  })

  request.setHeader('Content-Type', 'application/json');
  request.end()
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

//console.log("EXTRACT IPC WORKS");