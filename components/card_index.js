let $ = { jquery } = require('jquery');

exports.CardIndex = function (object) {
    let div_card = $('<div class="card"></div>');

    let div_image = $('<div class="card__image-holder"></div>');
    let image = $(`<img class="card__image" src="${object.image}" alt="Image not found" />`);

    let div_title = $(`<div class="card-title"></div>`)
    let button_title = $(`<a href="#" class="toggle-info btn">
                            <span class="left"></span>
                            <span class="right"></span>
                        </a>`)
    let title = $(`<h2>${object.name}
                    <small>${object.address}</small>
                </h2>`)

    let bottom = $(`<div class="card-flap flap1"></div>`)
    let description = $(`<div class="card-description">${object.description}</div>`)
    let bottom_more = $(`<div class="card-flap flap2">
                            <div class="card-actions">
                                <a href="login.html" class="btn">Read more</a>
                            </div>
                        </div>`)

    return div_card.append(div_image.append(image), div_title.append(button_title, title), bottom.append(description, bottom_more))
}