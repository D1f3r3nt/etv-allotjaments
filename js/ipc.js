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
  const valueRequest = {
      method: 'GET',
      protocol: 'http:',
      hostname: 'etv.dawpaucasesnoves.com/etvServidor/public',
      // port:'80',
      path: '/api/login'
  }
  const request = net.request(valueRequest);
  request.on('response', (response) => {

          // 
          e.sender.send('check_user', response)

  })
  request.end()
  
})

//console.log("EXTRACT IPC WORKS");