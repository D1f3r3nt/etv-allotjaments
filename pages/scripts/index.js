let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('#container')

$(() => {

  ipcRenderer.send('get_allotjaments');

  ipcRenderer.on('res_get_allotjaments', (_, dato) => {
    let response = dato.data

    response.map(dato => {
      cards.append(CardIndex({
        id: dato.id,
        image: 'https://loremflickr.com/300/225/house',
        name: dato.nom,
        description: dato.descripcio
      }))
    });
  })

});