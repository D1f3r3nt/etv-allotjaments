const { app, BrowserWindow, Menu } = require('electron');
const { myMenu } = require('./components/menu');
const ipc = require('./js/ipc');

let current_window;

function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            contextIsolation: false, // Para hacer que la ventana no sea unicamente cerrada
            nodeIntegration: true, //Para usar Node en la pagina
        },
        icon: 'image/ETV.ico',
        title: 'ETV Allotjaments',
    });

    Menu.setApplicationMenu(myMenu(win));

    win.loadFile('./pages/index.html');

    ipc.init(win);

    return win;
}

app.whenReady().then(() => {
    current_window = createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

//Messages
ipc