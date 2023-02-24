let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");

const map = L.map('map').setView([39.627137, 2.977492], 9);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$(() => {
    ipcRenderer.send('get_allotjaments');
    ipcRenderer.on('res_get_allotjaments', (_, dato) => {
        const response = dato.data;

        response.map(value => {
            if (value.aprovat === 1){
                L.marker([value.latitud, value.longitud]).addTo(map).bindPopup(value.nom);
            }
        });
    })
});