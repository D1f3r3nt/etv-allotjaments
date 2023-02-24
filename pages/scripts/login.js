let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");

const cancel = $('#cancel');
const send = $('#send');

send.on('click', (evt) => {
    evt.preventDefault();

    let credencials = JSON.parse(`{
        "email": "${document.getElementById("inputUser").value}",
        "password": "${document.getElementById("inputPassword").value}"
      }`);

    ipcRenderer.send('post_login', credencials);
});

cancel.on('click', () => {
    ipcRenderer.send('close_window');
});

ipcRenderer.on('res_post_login', (_, data) => {

    if(data.status === "error"){
        alert("Error al introduir les credencials")
    }else{
        ipcRenderer.send('close_window');
    }

});
