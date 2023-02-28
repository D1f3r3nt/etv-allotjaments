let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { snackCorrect, snackError } = require('../components/snackbars.js');

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
const categoria = $('#categoria');
const tallotjaments = $('#tallotjaments');
const tvacances = $('#tvacances');

let idUsuari;

$(() => {
    // Para coger usuario
    ipcRenderer.send('get_user_id');

    ipcRenderer.on('res_get_user_id', (e, id) => idUsuari = id);

    // Municipis
    ipcRenderer.send('get_municipis');

    ipcRenderer.on('res_get_municipis', (e, args) => {
        let municipis = args.data;
        municipis.forEach((e) => {
            municipio.append(`<option value="${e.id}">${e.municipi}, ${e.illa}</option>`);
        });
    });

    //Tipus allotjament
    ipcRenderer.send('get_tipus_allotjaments');

    ipcRenderer.on('res_get_tipus_allotjaments', (e, args) => {
        let tallotjament = args.data;
        tallotjament.forEach((e) => {
            tallotjaments.append(`<option value="${e.id}">${e.tipus_allotjament}</option>`);
        });
    });

    //Tipus vacances
    ipcRenderer.send('get_tipus_vacances');

    ipcRenderer.on('res_get_tipus_vacances', (e, args) => {
        let vac = args.data;
        vac.forEach((e) => {
            tvacances.append(`<option value="${e.id}">${e.tipus_vacances}</option>`);
        });
    });

    //Tipus categoria
    ipcRenderer.send('get_categories');

    ipcRenderer.on('res_get_categories', (e, args) => {
        let cat = args.data;
        cat.forEach((e) => {
            categoria.append(`<option value="${e.id}">${e.categoria}</option>`);
        });
    });

    //Mapa
    const map = L.map('map').setView([39.627137, 2.977492], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.on('click', function(e) {
        var popLocation= e.latlng;
        latitude.val(popLocation.lat);
        longitud.val(popLocation.lng);
        L.popup()
            .setLatLng(popLocation)
            .setContent("Nueva casa")
            .openOn(map);
    });

    create.on('click', (e) => {
        e.preventDefault();
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
            "propietari_id": `${idUsuari ?? 1}`,
            "categoria_id": categoria.val(),
            "longitud": parseFloat(longitud.val()).toFixed(6),
            "latitud": parseFloat(latitude.val()).toFixed(6)
        };

        console.log(data);
        ipcRenderer.send('post_allotjament', data);

        ipcRenderer.on('res_post_allotjament', (_, args) => {
            if (args.status === 'success') snackCorrect("Allotjament creat");
            else snackError(`ERROR: Nom repetit o NRegistre repetit`);
        });
    });
});