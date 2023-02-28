let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');

const cancel = $('#cancel');
const send = $('#send');
const rememberIn = $('#remember');

const inputPassword = $('#inputPassword');
const inputUser = $('#inputUser');

$(() => {
    ipcRenderer.send('get_storage');

    ipcRenderer.on('res_get_storage', (e, data) => {
        if (data.remember) {
            inputPassword.val(data.password);
            inputUser.val(data.user);
            rememberIn.prop("checked", true );
        }
    });
});

send.on('click', (evt) => {
    evt.preventDefault();
    ipcRenderer.send('clear_storage');

    if (rememberIn.is(':checked')) {
        ipcRenderer.send('save_storage', {
            user: inputUser.val(),
            password: inputPassword.val(),
        });
    }

    let credencials = JSON.parse(`{
        "email": "${inputUser.val()}",
        "password": "${inputPassword.val()}"
      }`);

    ipcRenderer.send('post_login', credencials);
});

cancel.on('click', () => {
    ipcRenderer.send('close_window');
});

ipcRenderer.on('res_post_login', (_, data) => {

    if(data.status === "error"){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuari o contraseña incorrecte'
          })
    }else{
        ipcRenderer.send('close_window');
    }

});
