let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('.cards')

$(() => {

  for (let index = 0; index < 10; index++) {
    cards.append(CardIndex({
      id: 1,
      image: 'https://loremflickr.com/300/225/house',
      name: 'nombre',
      address: 'adresa',
      description: 'descripcio'
    }))

  }

  //ipcRenderer.send('get_allotjaments');

  ipcRenderer.on('res_get_allotjaments', (_, data) => {
    let response = data.result.data;

    response.map(dato => {
      cards.append(CardIndex({
        id: data.ID,
        image: 'https://loremflickr.com/300/225/house',
        name: dato.nombre,
        address: dato.adresa,
        description: dato.descripcio
      }))
    });
  });
});