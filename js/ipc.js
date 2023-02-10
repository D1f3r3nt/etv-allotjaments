const { net, ipcMain, BrowserWindow } = require('electron')

//Variable token
let token;

// Close
ipcMain.on('close_window', (e, args) => {

  const login = BrowserWindow.fromWebContents(e.sender);
  login.close();

})

// GET all Allotjaments
ipcMain.on('get_allotjaments', (e, args) => {
  const valueRequest = {
    method: 'GET',
    protocol: 'http:',
    hostname: 'www.rampacom.com/ProyectoFinal/public',
    // port:'80',
    path: '/api/alojamiento'
}
  const request = net.request(valueRequest)
  request.on('response', (response) => {

    response.on('data', (chunk) => {
      e.sender.send('res_get_allotjaments', JSON.parse(chunk))
      //console.log(`BODY: ${chunk}`)
    })
  })
  request.end()
})

// POST Login
ipcMain.on('login', (e, args) => {

  //Variables
  var body = JSON.stringify(args);
  var statusCode

  // Request
  const request = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: 'www.rampacom.com/ProyectoFinal/public',
    // port:'80',
    path: '/api/Log/in',
  });

  request.on('response', (response) => {
      response.on('data', (chunk) => {
        e.sender.send('res_post_login', JSON.parse(chunk))
        
        // Guardar Token
        token = 'Bearer ' + responseData.data.token;
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
    protocol: 'http:',
    hostname: 'www.rampacom.com/ProyectoFinal/public',
    // port:'80',
    path: '/api/municipio',
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