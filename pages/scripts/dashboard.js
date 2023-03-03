let $ = { jquery } = require('jquery');
const { ipcRenderer } = require("electron");
const { Chart } = require("chart.js/auto");
const { snackCorrect, snackError } = require('../components/snackbars.js');

const pdf = $('#print-pdf');

// Variables
let densitatChart;
let caracterChart;
let reservesPropiesChart;
let ocupacioChart;
let municipis;
let allotjaments;
let userId;
let allotjamentId;
let any;
let reserves;

$(() => {
  ipcRenderer.send('get_municipis');
});

// Grafic Densitat Municipis
ipcRenderer.on('res_get_municipis', (e, args) => {
  municipis = args.data

  // Afagir valor densitat
  municipis.forEach(element => {
    element.densitat = 0
  });

  ipcRenderer.send('get_allotjaments');
})

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

  // Forms
  let forms = document.querySelectorAll('.forms');
  forms.forEach(i =>{
    i.classList.add('hidden');
  })
  if (id ==='capacitat'){
    document.querySelector('#selectAllotjament').classList.remove('hidden');
  } else if (id != 'perPobles') {
    document.querySelector('#selectAllotjament').classList.remove('hidden');
    document.querySelector('#selectAny').classList.remove('hidden');
  }

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
    case 'ocupacio': return 'Reserves';
    case 'reserves': return 'Ocupacio';
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

  // Grafic barres densitat allotjaments
  (async function () {

    const data = municipis;

    // Dades del Grafic
    var ctx = document.getElementById('grafic1');
    var dataChart = {
      type: 'bar',
      data: {
        labels: data.map(row => row.municipi),
        datasets: [
          {
            label: 'Densitat Allotjaments',
            data: data.map(row => row.densitat)
          }
        ]
      }
    }

    // Revisar si ja hi ha un gràfic, Destruirlo en cas que existeixi
    if (densitatChart) {
      densitatChart.destroy();
    }
    densitatChart = new Chart(ctx, dataChart);
  })();


  // Recuperar ID
  ipcRenderer.send('get_user_id');

});

// Recollir User ID
ipcRenderer.on('res_get_user_id', (e,args) =>{
  userId = args;

  // Generar Desplegable Cases del usuari
  let totalOwnAllotjaments =[]

  allotjaments.forEach(i =>{
    if (i.propietari.id == userId){
      ownAllotjament = {
        id: i.id,
        nom: i.nom
      }
      totalOwnAllotjaments.push(ownAllotjament)
    }
  })

  $("#selectAllotjament").append('<button onclick="indicarAllotjament()" class="btn btn-outline-secondary" type="button">Seleccionar</button>')
  $("#selectAllotjament").append('<select class="form-select" id="optionAllotjament"></select>')
  totalOwnAllotjaments.forEach(a =>{
    $("#optionAllotjament").append('<option value="' + a.id + '">' + a.nom + '</option>');
  })

})

// Calcular Caracteristiques
function calcularCaracteristiques(value){

  let totalCar = {npersones:0, nbanys:0, nllits:0, nhabitacions:0};
  let ownCar =  {npersones:0, nbanys:0, nllits:0, nhabitacions:0};
  let totalAllotjaments = 0;

  allotjaments.forEach(i =>{
    totalCar.npersones = totalCar.npersones + i.npersones;
    totalCar.nbanys = totalCar.nbanys + i.nbanys;
    totalCar.nllits = totalCar.nllits + i.nllits;
    totalCar.nhabitacions = totalCar.nhabitacions + i.nllits;

    if (i.id == value){
      ownCar.npersones = i.npersones;
      ownCar.nbanys = i.nbanys;
      ownCar.nllits = i.nllits;
      ownCar.nhabitacions = i.nhabitacions;
    }

    totalAllotjaments++;
  });

  // Carregar el grafic 2
  (async function () {

    const valors = {
      labels:[
          'Persones',
          'Habitacions',
          'Llits',
          'Banys'
      ],
      datasets:[{
        label: 'Mitjana global',
        data:[
            totalCar.npersones/totalAllotjaments,
            totalCar.nhabitacions/totalAllotjaments,
            totalCar.nllits/totalAllotjaments,
            totalCar.nbanys/totalAllotjaments
        ],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      },{
        label: 'Allotjament Actual',
        data: [
            ownCar.npersones,
            ownCar.nhabitacions,
            ownCar.nllits,
            ownCar.nbanys
        ],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    }

    // Dades del Grafic
    var ctx = document.getElementById('grafic2');
    var dataChart = {
      type: 'radar',
      data: valors,
      options: {
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            beginAtZero: true,
          }
        }
      }
    }

    // Revisar si ja hi ha un gràfic, Destruirlo en cas que existeixi
    if (caracterChart) {
      caracterChart.destroy();
    }
    caracterChart = new Chart(ctx, dataChart);
  })();
}

// Calcular Ocupació
ipcRenderer.on('res_get_reserves', (event, args) =>{

  reserves = args.data;

  // Cercar anys reserves
  let anys = [];

  reserves.forEach(i =>{
    var desde = new Date(i.desde);
    let flag = 0
    anys.forEach(j =>{
      if (j == desde.getFullYear()){
        flag = flag + 1;
      }
    })
    if (flag == 0){
      anys.push(desde.getFullYear())
    }
  })
  $("#selectAny").empty();
  $("#selectAny").append('<button onclick="indicarAny()" class="btn btn-outline-secondary" type="button">Seleccionar</button>')
  $("#selectAny").append('<select class="form-select" id="optionAny"></select>')
  anys.forEach(a =>{
    $("#optionAny").append('<option value="' + a + '">' + a + '</option>');
  })


})


// Indicar Allotjament
function indicarAllotjament(){
  allotjamentId = $("#optionAllotjament").val();
  //$("#selectAny").remove()
  calcularCaracteristiques(allotjamentId);
  // Calcular ocupacio
  ipcRenderer.send('get_reserves');
}

// Indicar Any i calculs d'ocupacio
function indicarAny(){
  any = $("#optionAny").val();

  reservesPropies();
  ocupacio();
}


function reservesPropies(){

  // ALLOTJAMENT 1    // Es l'únic que te dades
  allotjamentId = 1;

  let reservesId = 0;
  let reservesTotal = 0;

  console.log(reserves);
  reserves.forEach(i =>{
    var desde = new Date(i.desde);

    if (i.allotjament_id == allotjamentId && desde.getFullYear() == any){
      reservesId ++
    }

    if (desde.getFullYear() == any){
      reservesTotal ++;
    }
  });

  // Carregar el grafic 3
  (async function () {

    const valors = {
      labels:[
        'Reserves Totals',
        'Reserves del Allotjament'
      ],
      datasets:[{
        data:[reservesTotal,reservesId],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)'
        ]
      }]
    }

    // Dades del Grafic
    var ctx = document.getElementById('grafic3');
    var dataChart = {
      type: 'polarArea',
      data: valors
    }

    // Revisar si ja hi ha un gràfic, Destruirlo en cas que existeixi
    if (reservesPropiesChart) {
      reservesPropiesChart.destroy();
    }
    reservesPropiesChart = new Chart(ctx, dataChart);
  })();
}


function ocupacio(){

  // ALLOTJAMENT 1    //Es l'únic que te dades
  allotjamentId = 1;

  let diesTotals = 0

  console.log(reserves);
  reserves.forEach(i =>{
    var desde = new Date(i.desde);
    var fins = new Date(i.fins);

    if (i.allotjament_id == allotjamentId && desde.getFullYear() == any){
      var dies = fins.getDate() - desde.getDate()
      diesTotals = diesTotals + dies
    }
  });

  // Carregar el grafic 3
  (async function () {

    const valors = {
      labels:[
        'Dies Ocupats',
        'Dies Lliure'
      ],
      datasets:[{
        data:[diesTotals,365-diesTotals],
        backgroundColor: [
          'rgb(255, 205, 86)',
          'rgb(54, 162, 235)'
        ]
      }]
    }

    // Dades del Grafic
    var ctx = document.getElementById('grafic4');
    var dataChart = {
      type: 'polarArea',
      data: valors
    }

    // Revisar si ja hi ha un gràfic, Destruirlo en cas que existeixi
    if (ocupacioChart) {
      ocupacioChart.destroy();
    }
    ocupacioChart = new Chart(ctx, dataChart);
  })();
}