let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('#container')

$(() => {

  ipcRenderer.send('get_allotjaments');

  ipcRenderer.on('res_get_allotjaments', (_, dato) => {
    const response = dato.data;

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
  })

});

function masInfo(id) {
  ipcRenderer.send('load_page_detalls', id);
}