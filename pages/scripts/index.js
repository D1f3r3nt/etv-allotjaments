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
    let response = dato.result.data;

        response.map(dato => {
            cards.append(CardIndex({
                id: dato.id,
                image: 'https://loremflickr.com/300/225/house',
                name: dato.nom,
                address: dato.carrer,
                description: dato.descripcio
            }))
        });
    })

});

$(document).ready(function(){
  var zindex = 10;
  
  $("div.card").click(function(e){
    e.preventDefault();

    var isShowing = false;

    if ($(this).hasClass("show")) {
      isShowing = true
    }

    if ($("div.cards").hasClass("showing")) {
      // a card is already in view
      $("div.card.show")
        .removeClass("show");

      if (isShowing) {
        // this card was showing - reset the grid
        $("div.cards")
          .removeClass("showing");
      } else {
        // this card isn't showing - get in with it
        $(this)
          .css({zIndex: zindex})
          .addClass("show");

      }

      zindex++;

    } else {
      // no cards in view
      $("div.cards")
        .addClass("showing");
      $(this)
        .css({zIndex:zindex})
        .addClass("show");

      zindex++;
    }
    
  });
});