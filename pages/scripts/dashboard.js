let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { Chart } = require("chart.js/auto");

// Variables
let barChart
let municipis

$(() => {

  // Municipis
  ipcRenderer.send('get_municipis');

});

// Grafic
ipcRenderer.on('res_get_municipis', (e, args) => {
  municipis = args.data

  // Afagir valor densitat
  municipis.forEach(element => {
    element.densitat = 0
  });

  ipcRenderer.send('get_allotjaments');
})

ipcRenderer.on('res_get_allotjaments', (e, args) => {

  allotjaments = args.data;

  // Calcular densitat d'allotjaments per municipi
  allotjaments.forEach(all_el => {
    municipis.forEach(mun_el => {
      if (mun_el.id == all_el.municipi_id) {
        mun_el.densitat++;
      }
    })
  });

  // Grafic barres
  (async function () {

    const data = municipis;
    // Array de Municipis per agafar
    console.log(municipis)

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