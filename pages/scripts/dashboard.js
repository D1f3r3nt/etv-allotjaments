let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { Chart } = require("chart.js/auto");
const { snackCorrect, snackError } = require('../components/snackbars.js');

const pdf = $('#print-pdf');

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
});

pdf.on('click', () => {
  ipcRenderer.send('print_to_pdf');

  ipcRenderer.on('res_print_to_pdf', (_, response) => {
    if (response.status) {
      snackCorrect('Arxiu creat');
    } else {
      snackError(response.message);
    }
  });
})

function change(id) {
  // Style de los elementos del nav
  let items = document.querySelectorAll('.nav-item');
  items.forEach(i => i.classList.remove('active'))

  document.querySelector(`#${id}`)
          .classList
          .add('active');

  // Titulo
  document.getElementById('nomDash').innerHTML = idPerName(id);

  // Grafica
  let grafics = document.querySelectorAll('#zona > canvas');
  grafics.forEach(i => i.classList.add('hidden'))

  document.querySelector(`#${idPerGrafic(id)}`)
          .classList
          .remove('hidden');
}

function idPerName(id) {
  switch (id) {
    case 'perPobles': return 'Per pobles';
    case 'capacitat': return 'Capacitat';
    case 'ocupacio': return 'Ocupacio';
    case 'reserves': return 'Reserves';
    default: return '';
  }
}

function idPerGrafic(id) {
  switch (id) {
    case 'perPobles': return 'grafic1';
    case 'capacitat': return 'grafic2';
    case 'ocupacio': return 'grafic3';
    case 'reserves': return 'grafic4';
    default: return '';
  }
}