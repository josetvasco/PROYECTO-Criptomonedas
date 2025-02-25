const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: ''
}

const obtenerCriptomonedas= criptomonedas => new Promise( resolve  => {
  resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();

  formulario-addEventListener('submit', submitFormulario);

  criptomonedasSelect.addEventListener('change', leerValor); 
  monedaSelect.addEventListener('change', leerValor); 
})

async function consultarCriptomonedas() {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  fetch(url)
    .then( respuesta => respuesta.json() )
    .then( resultado => obtenerCriptomonedas(resultado.Data) )
    .then( criptomonedas => selectCriptomonedas(criptomonedas))

  const resouesta = await fetch(url);
  const resultado = respuesta.json();
  const criptomonedas = await obtenerCriptomonedas(resultado.Data);
  selectCriptomonedas(criptomonedas)
}

function selectCriptomonedas( criptomonedas ) {
  criptomonedas.forEach( cripto => {
    const { FullName, Name } = cripto.CoinInfo;
    
    const option = document.createElement('OPTION');
    option.value = Name;
    option.textContent = FullName;

    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();

  const { moneda, criptomoneda } = objBusqueda;

  if( !moneda || !criptomoneda ) {
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }

  //Consultar la APi con los resultados
  consultarAPI();
}

function mostrarAlerta( mensaje ) {
  const existeError = document.querySelector('.error');

  if(!existeError) {
    const divMensaje = document.createElement('DIV');
    divMensaje.classList.add('error');
  
    divMensaje.textContent = mensaje;
  
    formulario.appendChild(divMensaje);
  
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  // fetch(url)
  //   .then(respuesta => respuesta.json())
  //   .then(resultado => mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda]))

  try {
    const respuesta = await fetch(url);
    const resultado = await respuesta.json();
    mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
  } catch (error) {
    console.log(error)
  }
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `El precio es: <span>${PRICE}</span>`;
 
  const precioAlto = document.createElement('P');
  precioAlto.innerHTML = `Precio más alto del día <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('P');
  precioBajo.innerHTML = `Precio más bajo del día <span>${LOWDAY}</span>`;
  
  const ultimasHoras = document.createElement('P');
  ultimasHoras.innerHTML = `Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;
  
  const ultimaActualizacion = document.createElement('P');
  ultimaActualizacion.innerHTML = `Última actualización <span>${LASTUPDATE === 'Just now' ? 'Justo Ahora' : LASTUPDATE }</span>`;
  
  resultado.append(precio, precioAlto, precioBajo, ultimasHoras, ultimaActualizacion);
}

function limpiarHTML() {
  while(resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);  
  }
}

function mostrarSpinner() {
  limpiarHTML();

  const spinner = document.createElement('DIV');
  spinner.classList.add('spinner');

  spinner.innerHTML = `
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  `

  resultado.append(spinner);
}