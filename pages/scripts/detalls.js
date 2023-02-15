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
const goBack = $('#go_back');

$(() => {
    ipcRenderer.send('load_data');

    ipcRenderer.on('res_load_data', (e, args) => {
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
    });

    goBack.on('click', () => {
        ipcRenderer.send('load_home_page');
    })
});