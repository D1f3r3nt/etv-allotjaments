let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { Chart } = require("chart.js/auto");

// Variables
let barChart
let municipis


var map = L.map('map').setView([39.627137, 2.977492], 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$(() => {

    // Test Mapa d'aprovats
    ipcRenderer.send('get_allotjaments');
    ipcRenderer.on('res_get_allotjaments', (_, dato) => {

      const response = dato.data;
      response.map(value => {
        
        if (value.aprovat == 1){
            L.marker([value.latitud, value.longitud]).addTo(map).bindPopup(value.nom);
            // console.log(value.nom)
            // console.log(value.latitud)
            // console.log(value.longitud)
        }
      });
    })

    // End Test Mapa

    // Municipis
    ipcRenderer.send('get_municipis');

  });

// Grafic
// Canal d'entrada de la consulta
ipcRenderer.on('res_get_municipis', (e, args) => {

  // Array de Municipis
  municipis = args.data

  // Afagir valor densitat
  municipis.forEach(element => {
    element.densitat = 0

  });
  console.log(municipis);

  ipcRenderer.send('get_allotjaments');
})

ipcRenderer.on('res_get_allotjaments', (e, args) => {

  allotjaments = args.data;

  allotjaments.forEach(all_el => {
    municipis.forEach(mun_el=>{
      if (mun_el.id == all_el.municipi_id){
        mun_el.densitat++;
      }
    })
  });

  console.log(municipis);

    // Grafic barres
    (async function () {

      const data = municipis;
      // Array de Municipis per agafar
  
      // Dades del Grafic
      var ctx = document.getElementById('grafic1');
      var dataChart = {
        type: 'bar',
        data: {
          labels: data.map(row => row.municipi),
          datasets: [
            {
              label: 'Allotjaments',
              data: data.map(row => row.densitat)
            }
          ]
        }
      }
  
      // Revisar si ja hi ha un gràfic, Destruirlo en cas que existeixi
      if (barChart) {
        barChart.destroy();
      }
      barChart = new Chart(ctx, dataChart);
    })();


})






