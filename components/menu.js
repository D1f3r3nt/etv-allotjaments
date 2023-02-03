const { Menu } = require('electron/main');
// Esta clase se encarga del menu

/**
 * Creamos el menu y lo exportamos a la vez
 * @param {*} win le pasamos el elemento de BrowserWindow
 * @returns devuelve el menu ya preparado
 */
exports.myMenu = function (win) {
    const template = [
        {
            label: 'Home',
            click: () => win.loadFile('pages/index.html')
        },
        {
            label: 'Login',
            click: () => console.log('Login')
        }
    ];

    return Menu.buildFromTemplate(template);
}
