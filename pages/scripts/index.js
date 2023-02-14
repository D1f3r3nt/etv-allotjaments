let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('#container')

$(() => {

  ipcRenderer.send('get_fotos');

  ipcRenderer.on('res_get_fotos', (_, dato) => {
    const response = dato.data;

    response.map(value => {
      cards.append(CardIndex({
        id: value.allotjament.allotjament_id,
        image: value.url,
        name: value.allotjament.nom,
        description: value.allotjament.descripcio
      }))
    });
  })

});