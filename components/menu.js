const { Menu, app, BrowserWindow } = require('electron/main');

const isMac = process.platform === 'darwin';



/**
 * Creamos el menu y lo exportamos a la vez
 * @param {*} win le pasamos el elemento de BrowserWindow
 * @returns devuelve el menu ya preparado
 */
exports.myMenu = function (win) {
  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // Home Section
    {
      label: 'Home',
      submenu: [
        {
          label: 'Home',
          click: () => win.loadFile('./pages/index.html')
        }
      ]
    },
    {
      label: 'Login',
      submenu: [
        {
          label: 'Login',
          click: () => createLogin(win)
        }
      ]
    }

  // DEVELOPING MENU
  // Comentar abans d'entregar
  // {
  //   label: 'Developer',
  //   submenu: [
  //     {
  //       role: 'toggleDevTools',
  //     },
  //     {
  //       label: 'Test Screen',
  //       click: () => win.loadFile('./pages/test.html')
  //     }
  //   ]
  // }
  ];

  return Menu.buildFromTemplate(template);
}

function createLogin(win) {
  const login = new BrowserWindow({
    height: 500,
    width: 500,
    webPreferences: {
      contextIsolation: false, // Para hacer que la ventana no sea unicamente cerrada
      nodeIntegration: true, //Para usar Node en la pagina
    },
    title: 'Login on ETV Allotjaments',
    parent: win,
    modal: true,
    resizable: false,
    frame: false,
  });

  login.loadFile('./pages/login.html');

  return login;
}
