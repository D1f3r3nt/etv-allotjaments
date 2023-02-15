const { net, app, BrowserWindow, ipcMain, Menu } = require('electron');
const { myMenu } = require('./components/menu');
const ipc = require('./js/ipc');

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public'
const hostProtocol = 'http:'

let current_window;

function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            contextIsolation: false, // Para hacer que la ventana no sea unicamente cerrada
            nodeIntegration: true, //Para usar Node en la pagina
        },
        title: 'ETV Allotjaments',
    });

    Menu.setApplicationMenu(myMenu(win));

    win.loadFile('./pages/index.html');

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

ipcMain.on('load_page_detalls', (e, id) => {
    current_window.loadFile('./pages/detalls.html');

    ipcMain.on('load_data', (e, args) => {
        const valueRequest = {
            method: 'GET',
            protocol: hostProtocol,
            hostname: hostApi,
            // port:'80',
            path: `/api/allotjaments/${id}`,
        }

        const request = net.request(valueRequest)

        request.on('response', (response) => {
            response.on('data', (chunk) => {
                try {
                    e.sender.send('res_load_data', JSON.parse(chunk))
                    //console.log(`BODY: ${chunk}`)
                } catch (e) {
                    console.log(e);
                }
            })
        })

        request.setHeader('Content-Type', 'application/json');
        request.end()

    });
});

ipcMain.on('load_home_page', () => {
    current_window.loadFile('./pages/index.html')
});

//Messages
ipc