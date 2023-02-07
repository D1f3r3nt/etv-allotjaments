let $ = { jquery } = require('jquery');
const { CardIndex } = require('../components/card_index.js');
const cards = $('.cards')

$(() => {
    for (let index = 0; index < 10; index++) {
        cards.append(CardIndex({
            image: 'https://source.unsplash.com/300x225/?wave',
            name: 'Prueba',
            address: 'Manacor',
            description: 'Prueba numero 1'
        }))
    }
});