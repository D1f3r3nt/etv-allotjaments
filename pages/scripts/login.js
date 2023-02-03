let $ = { jquery } = require('jquery');
const jquery_validation = require('jquery-validation');
const { ipcRenderer } = require("electron");

const cancel = $('#cancel');

$(() => {
    $('#login-form').validate({
        messages: {
            user: "Ponga su usuario",
            password: "Ponga su contraseña"
        },
        submitHandler: function (form) {
            form.preventDefault();
            console.log('A');
        }
    });
});

cancel.on('click', () => {
    ipcRenderer.send('close_window');
});