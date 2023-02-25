let $ = { jquery } = require('jquery');

exports.WithoutData = function () {

    let div_cover = $(`<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column"></div>`);

    let main = $(`<main class="px-3"></main>`);

    let title = $(`<h1>No hi ha dades</h1>`);

    let info = $(`<p class="lead">No hi ha dades per aquesta recerca, proba a introduir uns altres parametres.</p>`);

    return div_cover.append(main.append(title, info));
}