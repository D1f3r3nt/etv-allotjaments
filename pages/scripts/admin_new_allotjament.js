let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");

const create = $('#create');
const nom = $('#nom');
const numeroRegistre = $('#numeroRegistre');
const descripcio = $('#descripcio');
const carrer = $('#carrer');
const numero = $('#numero');
const piso = $('#piso');
const municipio = $('#municipio');
const latitude = $('#latitude');
const longitud = $('#longitud');
const npersones = $('#npersones');
const nllits = $('#nllits');
const nhabitacions = $('#nhabitacions');
const nbanys = $('#nbanys');
const propietari = $('#propietari');
const categoria = $('#categoria');
const tallotjaments = $('#tallotjaments');
const tvacances = $('#tvacances');

$(() => {
    create.on('click', () => {
        console.log('CLICK');
        const data = {
            "nom": nom.val(),
            "descripcio": descripcio.val(),
            "nregistre": numeroRegistre.val(),
            "npersones": npersones.val(),
            "nbanys": nbanys.val(),
            "nllits": nllits.val(),
            "nhabitacions": nhabitacions.val(),
            "carrer": carrer.val(),
            "numero": numero.val(),
            "pisporta": piso.val(),
            "municipi_id": municipio.val(),
            "tipus_allotjament_id": tallotjaments.val(),
            "tipus_vacances_id": tvacances.val(),
            "propietari_id": propietari.val(),
            "categoria_id": categoria.val(),
            "longitud": longitud.val(),
            "latitud": latitude.val()
        };
        console.log(data);
        ipcRenderer.send('post_allotjament', data);

        ipcRenderer.on('res_post_allotjament', (_, args) => {
            if (args.status === 'success') console.log('OK');
            else console.log('False')
        });
    });
});