let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { default: Swal } = require('sweetalert2');
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
const map = L.map('map').setView([39.627137, 2.977492], 9);

let idUsuari;
let idPropietari = '-100'
let modifing = false;

let mun;
let ta;
let tv;
let cat;

$(() => {
    create.html('Create');

    ipcRenderer.on('res_load_data', (_, value) => {
        create.empty();
        create.html('Modify');
        modifing = true;
        console.log(value.data)

        idPropietari = value.data.propietari_id;
        nom.val(value.data.nom);
        numeroRegistre.val(value.data.nregistre);
        descripcio.val(value.data.descripcio);
        carrer.val(value.data.carrer);
        numero.val(value.data.numero);
        piso.val(value.data.pisporta);
        mun = value.data.municipi_id;
        latitude.val(value.data.latitud);
        longitud.val(value.data.longitud);
        npersones.val(value.data.npersones);
        nllits.val(value.data.nllits);
        nhabitacions.val(value.data.nhabitacions);
        nbanys.val(value.data.nbanys);
        cat = value.data.categoria_id;
        ta = value.data.tipus_allotjament_id;
        tv = value.data.tipus_vacances_id;

        // Mapa
        var popLocation= L.latLng(parseFloat(latitude.val()), parseFloat(longitud.val()));
        L.popup()
            .setLatLng(popLocation)
            .setContent("Nueva casa")
            .openOn(map);

    });

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
        if (modifing) {
            municipio.val(mun);
        }
    });

    //Tipus allotjament
    ipcRenderer.send('get_tipus_allotjaments');

    ipcRenderer.on('res_get_tipus_allotjaments', (e, args) => {
        let tallotjament = args.data;
        tallotjament.forEach((e) => {
            tallotjaments.append(`<option value="${e.id}">${e.tipus_allotjament}</option>`);
        });
        if (modifing) {
            tallotjaments.val(ta);
        }
    });

    //Tipus vacances
    ipcRenderer.send('get_tipus_vacances');

    ipcRenderer.on('res_get_tipus_vacances', (e, args) => {
        let vac = args.data;
        vac.forEach((e) => {
            tvacances.append(`<option value="${e.id}">${e.tipus_vacances}</option>`);
        });

        if (modifing) {
            tvacances.val(tv);
        }
    });

    //Tipus categoria
    ipcRenderer.send('get_categories');

    ipcRenderer.on('res_get_categories', (e, args) => {
        let cate = args.data;
        cate.forEach((e) => {
            categoria.append(`<option value="${e.id}">${e.categoria}</option>`);
        });

        if (modifing) {
            categoria.val(cat);
        }
    });

    //Mapa
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
        
        if (modifing && idUsuari !== idPropietari) {
            Swal.fire({
                icon: 'error',
                title: 'No pots modificar',
                text: `No ets el propietari d'aquest allotjament`
              });
            
            return;
        }

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
        
        if (modifing) {
            const all = {
                "id": idUsuari,
                "data": data
            }

            ipcRenderer.send('put_allotjament', all);

            ipcRenderer.on('res_put_allotjament', (_, args) => {
                if (args.status === 'success') snackCorrect("Allotjament modificat");
                else snackError(`ERROR: Nom repetit o NRegistre repetit`);
            });

        } else {

            ipcRenderer.send('post_allotjament', data);

            ipcRenderer.on('res_post_allotjament', (_, args) => {
                if (args.status === 'success') snackCorrect("Allotjament creat");
                else snackError(`ERROR: Nom repetit o NRegistre repetit`);
            });
        }
    });
});