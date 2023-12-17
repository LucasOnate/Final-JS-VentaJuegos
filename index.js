const APIKEY = "093f4b686cb54db8ab4bf142f69a05bb";
const BASEURL = "https://api.rawg.io/api/";

class Juego {
  constructor(juego) {
    this.id = juego.id;
    this.slug = juego.slug;
    this.name = juego.name;
    this.background_image = juego.background_image;
    this.metacritic = juego.metacritic;
    this.cantidad = 0;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    if (this.cantidad > 0) {
      this.cantidad--;
    }
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.metacritic * this.cantidad;
  }
}

let carrito = chequearCarritoEnStorage();

function imprimirJuegosEnHTML(array) {
  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";
  for (const juego of array) {
    console.log("asd");
    let card = document.createElement("div");
    card.innerHTML = `
    <div class="card text-center m-2 mb-5" style="width: 18rem;">
    <div class="card-body" style=" height: 33rem; ">
            <img src="${juego.background_image}" id="" class="card-img-top img-fluid" alt="Juego">
            <h2 class="card-title">${juego.name}</h2>
            <h5 class="card-subtitle mb-2 text-muted">${juego.slug}</h5>
            <p class="card-text fs-2 fw-bold">$${juego.metacritic}</p>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button id="agregar${juego.id}" type="button" class="btn btn-success"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg> Agregar</button>
            </div>
        </div>
    </div>      
    `; //CODIGO BOOTSTRAP PARA TARJETAS, INGRESADO AL HTML VIA JS

    contenedor.appendChild(card); //AGREGO LA TARJETA AL CONTENEDOR

    let boton = document.getElementById(`agregar${juego.id}`);
    boton.addEventListener("click", () => agregarAlCarrito(juego));
  }
}
function agregarAlCarrito(juego2) {
  let index = carrito.findIndex((elemento) => elemento.id === juego2.id);

  if (index !== -1) {
    carrito[index].agregarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    let juego = new Juego(juego2);
    juego.agregarUnidad(); // Asegúrate de incrementar la cantidad al agregar el juego
    juego.actualizarPrecioTotal(); // Actualiza el precio total del juego
    carrito.push(juego);
  }
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
  let index = carrito.findIndex((element) => element.id === id);
  if (carrito[index].cantidad > 1) {
    carrito[index].quitarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    carrito.splice(index, 1);
  }
  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}
function eliminarCarrito() {
  carrito = [];
  localStorage.removeItem("carritoEnStorage");
  swal("Compra eliminada con éxito", "", "success");

  document.getElementById("tabla-carrito").innerHTML = "";
  document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
  return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function imprimirTabla(array) {
  let contenedor = document.getElementById("tabla-carrito");
  contenedor.innerHTML = "";
  let tabla = document.createElement("div");
  tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped table-light text-align-center justify-content-center">
            <thead>         
                <tr>
                    <th>Item</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Accion</th>
                </tr>
            </thead>

            <tbody id="bodyTabla">

            </tbody>
        </table>
    `;

  contenedor.appendChild(tabla);
  let bodyTabla = document.getElementById("bodyTabla");

  for (let juego of array) {
    console.log(juego);
    let datos = document.createElement("tr");
    datos.innerHTML = `
              <td>${juego.name}</td>
              <td>${juego.cantidad}</td>
              <td>$${juego.metacritic}</td>
              <td><button id="eliminar${juego.id}" class="btn btn-danger">Eliminar</button></td>
    `;

    bodyTabla.appendChild(datos);

    let botonEliminar = document.getElementById(`eliminar${juego.id}`);
    botonEliminar.addEventListener("click", () => eliminarDelCarrito(juego.id));
  }

  let precioTotal = obtenerPrecioTotal(array);
  let accionesCarrito = document.getElementById("acciones-carrito");
  accionesCarrito.innerHTML = `
  <h5 class= "fs-2 p-3 mb-2 bg-success text-white" >Total carrito: $ ${precioTotal}</h5></br>
  <button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-warning">Vaciar Carrito</button>
`;
}

function chequearCarritoEnStorage() {
  let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

  if (contenidoEnStorage) {
    let array = [];

    for (const objeto of contenidoEnStorage) {
      let juego = new Juego(objeto); // Corregir aquí: Usa 'Juego' en lugar de 'juego'
      juego.actualizarPrecioTotal();
      array.push(juego);
    }
    imprimirTabla(array);
    return array;
  }
  return [];
}

// Función para obtener y procesar los datos del JSON
async function obtenerJuegos() {
  const contenedor = document.getElementById("contenedor");
  contenedor.innerHTML =
    "<h1 class='text-white text-center w-100'>Cargando...</h1>";
  try {
    const response = await fetch(BASEURL + "games?key=" + APIKEY);
    const juegos = await response.json();
    imprimirJuegosEnHTML(juegos.results);
  } catch (error) {
    console.error("Error al obtener los juegos:", error.message);
    contenedor.innerHTML = "<h1 '>Error al cargar juegos</h1>";
  }
}

// Llama a la función para obtener los Juegos al cargar la página
obtenerJuegos();
