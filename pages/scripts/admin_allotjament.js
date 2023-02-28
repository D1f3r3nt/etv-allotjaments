const { Grid, h, html } = require('gridjs');
let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");

let data = [];
$(() => {
    ipcRenderer.send('get_allotjaments');

    ipcRenderer.on('res_get_allotjaments', (_, dato) => {
        let response = dato.data;

        response.map(dato => {
            let info = [];
            info.push(dato.id);
            info.push(dato.nom);
            info.push(dato.nregistre);
            info.push(dato.propietari.nom);
            info.push(dato.propietari.dni);
            info.push(dato.carrer);
            info.push(dato.numero);
            info.push(dato.aprovat === 1 ? "Si" : "No");

            data.push(info);
        });

        taula(data);
    });

});

function information(id) {
    ipcRenderer.send('load_page_detalls', id);
}

function taula(params) {
    new Grid({
        columns: [
            "Id",
            "Titol",
            "N. Registre",
            "Propietari",
            "Dni",
            "Carrer",
            "Numero",
            {
                name: '',
                formatter: (cell, row) => {
                    return html(`<button id="${row.cells[0].data}" type="button" class="btn btn-info" onclick="information(this.id)"><i class="fa-solid fa-circle-info"></i></button>`);
                },
            },
            {
                name: '',
                formatter: (cell, row) => {
                    return h('button', {
                        className: 'btn btn-primary',
                        onClick: () => ipcRenderer.send('load_page_modify', row.cells[0].data)
                    }, 'Edit');
                },
            },
        ],
        style: {
            th: {
                'background-color': '#99d98c',
                'color': 'black',
            }
        },
        height: '65vh',
        data: params,
        search: true,
        fixedHeader: true,
        pagination: {
            limit: 15,
            summary: false
        }
    }).render(document.getElementById("wrapper"));
}