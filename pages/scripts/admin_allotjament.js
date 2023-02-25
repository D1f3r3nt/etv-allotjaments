const { Grid, h } = require('gridjs');
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

            data.push(info);
        });

        taula(data);
    });

});

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
                    return h('button', {
                        className: 'btn btn-primary',
                        onClick: () => alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`)
                    }, 'Edit');
                },
            },
        ],
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