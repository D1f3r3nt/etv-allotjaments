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
                address: dato.direccion,
                description: dato.descripcion
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