const { Menu, app, BrowserWindow } = require('electron/main');
const { myMenu } = require('./menu');

const isMac = process.platform === 'darwin';

/**
 * Creamos el menu y lo exportamos a la vez
 * @param {*} win le pasamos el elemento de BrowserWindow
 * @returns devuelve el menu ya preparado
 */

exports.myMenuLogged = function (win) {
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
    // Admin Menu
        {
          label: 'Administracio',
          submenu: [
            {
              label: 'Allotjaments',
              click: () => win.loadFile('./pages/admin_allotjament.html')
            },
            {
              label: 'Comentaris',
              click: () => createLogin(win)
            },
            {
              label: 'Reserves',
              click: () => createLogin(win)
            },
            {
              label: 'Serveis',
              click: () => createLogin(win)
            },
          ]
        },
    {
      label: 'LogOut',
      submenu: [
        {
          label: 'LogOut',
          click() {
            //Canviar Menu
            Menu.setApplicationMenu(myMenu(win));
            // Accions a realitzar quan es surt
          }
          
        }
      ]
    },
  // DEVELOPING MENU
  // Comentar abans d'entregar
  {
    label: 'Developer',
    submenu: [
      {
        role: 'toggleDevTools',
      }
    ]
  }
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