let $ = { jquery } = require('jquery');

exports.CardIndex = function (object) {
    let div_card = $(`<div id="${object.id}" class="card m-3"></div>`);

    let image = $(`<img src="${object.image}" class="card-img-top" alt="No disponible">`);

    let div_body = $('<div class="card-body d-flex flex-column"></div>');

    let title = $(`<h5 class="card-title">${object.title}</h5>`);

    let info = $(`<p class="card-text">${object.description}</p>`);

    let button = $(`<button class="btn btn-primary align-self-center">Ver mas</button>`);

    return div_card.append(image, div_body.append(title, info, button));
}