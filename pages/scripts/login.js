let $ = { jquery } = require('jquery');
const jquery_validation = require('jquery-validation');
const { ipcRenderer } = require("electron");

const cancel = $('#cancel');

// $(() => {
//     $('#login-form').validate({
//         messages: {
//             user: "Ponga su usuario",
//             password: "Ponga su contraseña"
//         },
//         submitHandler: function (form) {
//             form.preventDefault();
//             console.log('A');
//         }
//     });
// });

document.getElementById("login-form").addEventListener('submit', validar);
function validar(evt) {

    let credencials = JSON.parse(`{
        "email": "${document.getElementById("inputUser").value}",
        "password": "${document.getElementById("inputPassword").value}"
      }`)

      ipcRenderer.send('post_login', credencials);

    evt.preventDefault();
}

cancel.on('click', () => {
    ipcRenderer.send('close_window');
});

ipcRenderer.on('res_post_login', (_, data) => {

    if(data.status == "error"){
        alert("Error al introduir les credencials")
    }else{
        ipcRenderer.send('close_window');
    }

});
