let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { WithoutData } = require('../components/without_data.js');
const { ipcRenderer } = require("electron");

const cards = $('#container');
const nom = $('#nom');
const municipio = $('#municipio');
const categoria = $('#categoria');
const tallotjaments = $('#tallotjaments');
const boton = $('#filtrar');

let response;
$(() => {

  // Municipis
  ipcRenderer.send('get_municipis');

  ipcRenderer.on('res_get_municipis', (e, args) => {
      let municipis = args.data;
      //
      municipis.forEach((e) => {
          municipio.append(`<option value="${e.id}">${e.municipi}, ${e.illa}</option>`);
      });
  });

  //Tipus allotjament
  ipcRenderer.send('get_tipus_allotjaments');

  ipcRenderer.on('res_get_tipus_allotjaments', (e, args) => {
      let tallotjament = args.data;
      //
      tallotjament.forEach((e) => {
          tallotjaments.append(`<option value="${e.id}">${e.tipus_allotjament}</option>`);
      });
  });

  //Tipus categoria
  ipcRenderer.send('get_categories');

  ipcRenderer.on('res_get_categories', (e, args) => {
      let cat = args.data;
      //
      cat.forEach((e) => {
          categoria.append(`<option value="${e.id}">${e.categoria}</option>`);
      });
  });

  ipcRenderer.send('get_allotjaments');

  ipcRenderer.on('res_get_allotjaments', (_, dato) => {
    response = dato.data;
    loadData(dato.data);
  });

  boton.on('click', (event) => {
    let filterResponse = response;
    if (nom.val().trim().length > 0) {
      filterResponse = filterResponse.filter(r => r.nom.toLowerCase().includes(nom.val().toLowerCase()));
    }

    if (parseInt(municipio.val()) >= 0) {
      filterResponse = filterResponse.filter(r => r.municipi_id === parseInt(municipio.val()));
    }

    if (parseInt(tallotjaments.val()) >= 0) {
      filterResponse = filterResponse.filter(r => r.tipus_allotjament_id === parseInt(tallotjaments.val()));
    }

    if (parseInt(categoria.val()) >= 0) {
      filterResponse = filterResponse.filter(r => r.categoria_id === parseInt(categoria.val()));
    }

    loadData(filterResponse);
  });
});

function loadData(response) {
  cards.empty();

  response = response.filter(val => val.aprovat === 1)

  if (response.length == 0) {
    cards.append(WithoutData());
  }

  response.map(value => {
    let foto;
    if (!value.fotos[0]) {
      foto = 'https://loremflickr.com/300/225/house';
    } else {
      foto = value.fotos[0].url;
    }

    cards.append(CardIndex({
      id: value.id,
      image: foto,
      name: value.nom,
      description: value.descripcio
    }))
    
  });
}

function masInfo(id) {
  ipcRenderer.send('load_page_detalls', id);
}