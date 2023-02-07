let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const { ipcRenderer } = require("electron");

const cards = $('.cards')

$(() => {
    /*for (let index = 0; index < 10; index++) {
        cards.append(CardIndex({
            image: 'https://source.unsplash.com/300x225/?wave',
            name: 'Prueba',
            address: 'Manacor',
            description: 'Prueba numero 1'
        }))
    }*/

    ipcRenderer.send('get_allotjaments');

    ipcRenderer.on('res_get_allotjaments', (_, data) => {
        let response = data.result.data;

        response.map(dato => {
            cards.append(CardIndex({
                image: 'https://source.unsplash.com/300x225/?wave',
                name: dato.nombre,
                address: dato.adresa,
                description: dato.descripcio
            }))
        });
    })

});