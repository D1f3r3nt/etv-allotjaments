const { ipcMain, BrowserWindow, Menu } = require('electron');
const { myMenuLogged } = require('../components/menu_logged');
const { get, post, postWithToken, getWithToken } = require('./crud');
const Store = require('electron-store');
const store = new Store();

const hostApi = 'etv.dawpaucasesnoves.com/etvServidor/public';
const hostProtocol = 'http:';
let current_window;

//Variable token
let token;
let userId;
let user;
let password;

function init(win) {
    current_window = win;
}

// ========================
// Close a page
// ========================
ipcMain.on('close_window', (e, args) => {

    const login = BrowserWindow.fromWebContents(e.sender);
    login.close();
});

// ========================
// GET user id
// ========================
ipcMain.on('get_user_id', (e, _) => e.sender.send('res_get_user_id', userId));

// ========================
// GET local storage
// ========================
ipcMain.on('get_storage', (e, _) => {
    if (store.has('remember')) {
        if (!password || !user) {
            password = store.get('password');
            user = store.get('user');
        }

        e.sender.send('res_get_storage', {
            remember: true,
            user: user,
            password: password,
        });
    } else {
        e.sender.send('res_get_storage', {
            remember: false,
        });
    }
});

// ========================
// POST local storage
// ========================
ipcMain.on('save_storage', (_, data) => {
    store.set('remember', true);
    store.set('user', data.user);
    store.set('password', data.password);
});

// ========================
// DELETE local storage
// ========================
ipcMain.on('clear_storage', (y, x) => store.clear());

// ========================
// GET all Allotjaments
// ========================
ipcMain.on('get_allotjaments', (e, args) => {
    get('/api/allotjaments', (chunk) => {
        try {
            e.sender.send('res_get_allotjaments', JSON.parse(chunk));
        } catch(e) {}
    });
});

// ========================
// GET all Fotos
// ========================
ipcMain.on('get_fotos', (e, args) => {
    get('/api/fotos', (chunk) => {
        try {
            e.sender.send('res_get_fotos', JSON.parse(chunk))
        } catch(e) {}
    });
});


// ========================
// GET all Tipus allotjaments
// ========================
ipcMain.on('get_tipus_allotjaments', (e, args) => {
    get('api/tipus_allotjaments', (chunk) => {
        try {
            e.sender.send('res_get_tipus_allotjaments', JSON.parse(chunk))
        } catch(e) {}
    });
});

// ========================
// GET all Tipus vacances
// ========================
ipcMain.on('get_tipus_vacances', (e, args) => {
    get('api/tipus_vacances', (chunk) => {
        try {
            e.sender.send('res_get_tipus_vacances', JSON.parse(chunk))
        } catch(e) {}
    });
});


// ========================
// GET all Categorias
// ========================
ipcMain.on('get_categories', (e, args) => {
    get('api/categories', (chunk) => {
        try { 
            e.sender.send('res_get_categories', JSON.parse(chunk))
        } catch(e) {}
    });
});

// ========================
// GET Municipis
// ========================
ipcMain.on('get_municipis', (e, args) => {
    get('/api/municipis', (chunk) => {
        try { 
            e.sender.send('res_get_municipis', JSON.parse(chunk));
        } catch(e) {}
    })
});


// ========================
// GET Comentaris Per Id
// ========================
ipcMain.on('get_comentaris_id', (e, args) => {
    get(`/api/comentaris/${args}`, (chunk) => {
        try { 
            e.sender.send('res_get_comentaris_id', JSON.parse(chunk));
        } catch(e) {}
    });
});

// ========================
// POST Login
// ========================
ipcMain.on('post_login', (e, args) => {
    //Variables
    var body = JSON.stringify(args);

    post('/api/login', body, (chunk) => {
        try { 
            responseData = JSON.parse(chunk);
        } catch(e) {}
        e.sender.send('res_post_login', responseData);

        // Guardam Credencials si hi ha Login
        if (responseData.status === "success") {
            // Guardar Token
            token = 'Bearer ' + responseData.data.token;
            // Guardar Usuari
            userId = responseData.data.usuari.id;
            //Canviar Menu
            Menu.setApplicationMenu(myMenuLogged(current_window));
        }
    });
});

// ========================
// POST Allotjament
// ========================
ipcMain.on('post_allotjament', (e, args) => {
    //Variables
    var body = JSON.stringify(args);
    console.log(body);

    postWithToken('/api/allotjaments', body, token,(chunk) => {
        try {
            responseData = JSON.parse(chunk);
        } catch(e) {}
        console.log(responseData);
        e.sender.send('res_post_allotjament', responseData);
    });
});

// ========================
// Log Out
// ========================
function logout() {
    console.log("token at START: " + token);
    getWithToken('/api/logout', "", token, (chunk) => {
        //console.log(JSON.parse(chunk));
    });

    // Buidar Variables
    token = '';
    userId = '';
}

// ========================
// Carga pagina de detalles
// ========================
ipcMain.on('load_page_detalls', (e, id) => {
    current_window.loadFile('./pages/detalls.html');

    get(`/api/allotjaments/${id}`, (chunk) => {
        try {
        e.sender.send('res_load_data', JSON.parse(chunk))
        } catch(e) {}
    });
});

// ========================
// Cargar pagina principal
// ========================
ipcMain.on('load_home_page', () => current_window.loadFile('./pages/index.html'));

module.exports = {
    logout,
    init
};

