const { Menu, app } = require('electron/main');
// Esta clase se encarga del menu

const isMac = process.platform === 'darwin';



/**
 * Creamos el menu y lo exportamos a la vez
 * @param {*} win le pasamos el elemento de BrowserWindow
 * @returns devuelve el menu ya preparado
 */
exports.myMenu = function (win) {
    const template = [
        // { role: 'appMenu' }
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
              click: () => win.loadFile('pages/index.html')
            }
          ]
        },
        {
          label: 'Login',
          submenu: [
            {
              label: 'Login',
              click: () => console.log('A')            }
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
