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
          label: 'Llista allotjaments',
          click: () => win.loadFile('./pages/admin_allotjament.html')
        },
        {
          label: 'Crear allotjaments',
          click: () => win.loadFile('./pages/admin_new_allotjament.html')
        },
      ]
    },
    {
      label: 'Taulers',
      submenu: [
        {
          label: 'Taulers',
          click: () => win.loadFile('./pages/dashboard.html')
        },
      ],
    },
    {
      label: 'Mapa',
      submenu: [
        {
          label: 'Mapa',
          click: () => win.loadFile('./pages/mapa.html')
        },
      ],
    },
    {
      label: 'Logout',
      submenu: [
        {
          label: 'Logout',
          click() {
            //Canviar Menu
            Menu.setApplicationMenu(myMenu(win));
            // Accions a realitzar quan es surt
            const ipc = require('../js/ipc.js');
            ipc.logout();
            win.loadFile('./pages/index.html');
          }

        }
      ]
    },
    // DEVELOPING MENU
    // Comentar abans d'entregar
    // {
    //   label: 'Developer',
    //   submenu: [
    //     {
    //       role: 'toggleDevTools',
    //     }
    //   ]
    // }
  ];

  return Menu.buildFromTemplate(template);
}
