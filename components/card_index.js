let $ = { jquery } = require('jquery');

exports.CardIndex = function (object) {
    let div_card = $(`<div id="${object.id}" class="card"></div>`);

    let div_info = $('<div class="card__info-hover"></div>');

    let div_image = $(`<div class="card__img"></div>`);
    div_image.css('background-image', `url(${object.image})`)

    let button = $(`<a href="#" class="card_link"></a>`);

    let div_image_hover = $('<div class="card__img--hover"></div>')
    div_image_hover.css('background-image', `url(${object.image})`)

    let info = $(`<div class="card__info"></div>`);

    let category = $(`<span class="card__category">${object.adresa}</span>`)
    let title = $(`<div class="card-description">${object.description}</div>`)
    let by = $(`<span class="card__by">by <a href="#" class="card__author" title="author">${object.name}</a></span>`)

    return div_card.append(div_info, div_image, button.append(div_image_hover), info.append(category, title, by))
}