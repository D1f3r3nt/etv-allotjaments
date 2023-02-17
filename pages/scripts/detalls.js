let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");

const nom = $('#nom');
const nregistre = $('#nregistre');
const npersones = $('#npersones');
const nbanys = $('#nbanys');
const nllits = $('#nllits');
const nhabitacions = $('#nhabitacions');
const tallotjament = $('#tallotjament');
const tvacances = $('#tvacances');
const categoria = $('#categoria');
const imatge = $('#imatge');
const descripcio = $('#descripcio');
const carrer = $('#carrer');
const numero_carrer = $('#numero');
const pis = $('#pis');
const municipi = $('#municipi');
const illa = $('#illa');
const goBack = $('#go_back');
let mapa;


$(() => {
    ipcRenderer.send('load_data');
    //clear()

    ipcRenderer.on('res_load_data', (e, args) => {
        clear()
        let dato = args.data;

        nom.append(dato.nom);
        nregistre.append(dato.nregistre);
        npersones.append(dato.npersones);
        nbanys.append(dato.nbanys);
        nllits.append(dato.nllits);
        nhabitacions.append(dato.nhabitacions);
        tallotjament.append(dato.tipus_allotjament.tipus_allotjament);
        tvacances.append(dato.tipus_vacances.tipus_vacances);
        categoria.append(dato.categoria.categoria);
        imatge.attr("src", dato.fotos[0].url);
        descripcio.append(dato.descripcio);
        carrer.append(dato.carrer);
        numero_carrer.append(dato.numero);
        pis.append(dato.pisporta);
        municipi.append(dato.municipi.municipi);
        illa.append(dato.municipi.illa);

        mapa = L.map('mapa').setView([dato.latitud, dato.longitud], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapa);

        var marker = L.marker([dato.latitud, dato.longitud]).addTo(mapa);


    });

    goBack.on('click', () => {
        ipcRenderer.send('load_home_page');
    })
});

function clear() {
    imatge.empty();
    nom.empty();
    nregistre.empty();
    npersones.empty();
    nbanys.empty();
    nllits.empty();
    nhabitacions.empty();
    tallotjament.empty();
    tvacances.empty();
    categoria.empty();
    descripcio.empty();
    carrer.empty();
    numero_carrer.empty();
    pis.empty();
    municipi.empty();
    illa.empty();
    if (mapa) {
        mapa.remove();
    }
}