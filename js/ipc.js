const { net, ipcMain, BrowserWindow } = require('electron')

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
    hostname: 'etv.dawpaucasesnoves.com/etvServidor/public',
    // port:'80',
    path: '/api/allotjaments'
}
  const request = net.request(valueRequest)
  request.on('response', (response) => {

    response.on('data', (chunk) => {
      e.sender.send('get_allotjaments', JSON.parse(chunk))
      //console.log(`BODY: ${chunk}`)
    })
  })
  request.end()
})

// POST Login
ipcMain.on('check_user', (e, args) => {

  const { net } = require('electron')

  //Variables
  var body = JSON.stringify(args);
  var statusCode
  // var result

  // Request
  const request = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: 'etv.dawpaucasesnoves.com/etvServidor/public',
    // port:'80',
    path: '/api/login',
  });

  request.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
    statusCode = response.statusCode

    if (statusCode == 200) {
      response.on('data', (chunk) => {
        responseData = JSON.parse(chunk);

        result = JSON.parse('{' +
          '"status" : "' + statusCode + '",' +
          '"data": {' +
            '"nom" : "' + responseData.data.usuari.nom + '",' +
            '"token" : "' + responseData.data.token + '"' +
            '}' +
          '}')
      });
    } else {
      result = JSON.parse('{ "status" : "' + statusCode + '"}');
    }

    console.log(result);
    e.sender.send('post_login', result)

  });

  request.setHeader('Content-Type', 'application/json');
  request.write(body, 'utf-8');
  request.end();
})

//console.log("EXTRACT IPC WORKS");