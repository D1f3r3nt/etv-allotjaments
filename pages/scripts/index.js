let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('.cards')

$(() => {

    ipcRenderer.send('get_allotjaments');

    ipcRenderer.on('res_get_allotjaments', (_, data) => {
        let response = data.result.data;

        response.map(dato => {
            cards.append(CardIndex({
                image: 'https://loremflickr.com/300/225/house',
                name: dato.nombre,
                address: dato.adresa,
                description: dato.descripcio
            }))
        });
    })

});