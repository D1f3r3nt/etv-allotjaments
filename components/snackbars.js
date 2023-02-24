// Esta clase sirve para tener un feedback con el usurario mediante snackbars

/**
 * Sirve para enseñar un snackbar de correcta ejecucion
 * @param {*} text texto que ira dentro del Snackbar
 */
function snackCorrect(text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    x.innerHTML = `<i class="fa-solid fa-circle-check"></i>&nbsp<p>${text}</p>`;

    x.classList.remove("correct");
    x.classList.remove("error");
    x.classList.remove("warning");

    // Add the "show" class to DIV
    x.classList.add("correct");
    x.classList.add("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.classList.remove("show"); x.classList.remove("correct");}, 3000);
}

/**
 * Sirve para enseñar un snackbar de mala ejecucion
 * @param {*} text texto que ira dentro del Snackbar
 */
function snackError(text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    x.innerHTML = `<i class="fa-solid fa-exclamation"></i>&nbsp<p>${text}</p>`;

    x.classList.remove("correct");
    x.classList.remove("error");
    x.classList.remove("warning");

    // Add the "show" class to DIV
    x.classList.add("error");
    x.classList.add("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.classList.remove("show"); x.classList.remove("error");}, 3000);
}

/**
 * Sirve para enseñar un snackbar de ejecucion peligrosa
 * @param {*} text texto que ira dentro del Snackbar
 */
function snackWarning(text) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    x.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i>&nbsp<p>${text}</p>`;

    x.classList.remove("correct");
    x.classList.remove("error");
    x.classList.remove("warning");

    // Add the "show" class to DIV
    x.classList.add("warning");
    x.classList.add("show");

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.classList.remove("show"); x.classList.remove("warning");}, 3000);
}

/**
 * Exportamos todas las funciones
 */
module.exports = {
    snackCorrect,
    snackError,
    snackWarning
}