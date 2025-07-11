/* Santiago Leonardi
David Lago */
async function obtenerDatosProductos() {
    try {
        console.log('Obteniendo datos de productos...');
        let respuesta = await fetch(`${url}/productos`);
        let datos = await respuesta.json();
        // console.log(datos);
        //console.table(datos.payload);
        //mostrarProductos(datos);
        return datos.payload;
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

function mostrarProductos(array) {
    //Guardamos los productos guardados en payload
    console.log("Mostrando productos...");
    let listaProductos = array;
    console.log(listaProductos);
    //traemos el elemento ul de la lista 
    let productos_lista = document.getElementById("contenedor-productos");
    let htmlProducto = "";
    listaProductos.forEach(producto => {
        htmlProducto += `
        <div class="tarjeta-producto">
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" class="img-listados">
            <p>ID: ${producto.id}</p>
            <p>Precio: $${producto.precio}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})" data-id="${producto.id}">Agregar al carrito</button>
        </div>`

    });
    productos_lista.innerHTML = htmlProducto;
}

function mostrarCarrito() {
    let htmlCarrito = "";
    
    const contenedor = document.getElementById("contenedor-carrito");
    const carritoVacio = document.getElementById("carrito-vacio");
    const totalCarrito = document.getElementById("total-carrito");

    if (arrayCarrito.length === 0) {
        contenedor.innerHTML = "";
        contenedor.classList.add("hidden");
        carritoVacio.classList.remove("hidden");
        totalCarrito.classList.add("hidden"); // Oculta el total
        return;
    } else {
        contenedor.classList.remove("hidden");
        carritoVacio.classList.add("hidden");
        totalCarrito.classList.remove("hidden"); // Muestra el total
    }

    for (let i = 0; i < arrayCarrito.length; i++) {
        let producto = arrayCarrito[i];
        htmlCarrito += `<div class="tarjeta-producto">
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" class="img-listados">
            <p>ID: ${producto.id}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Cantidad: x${producto.cantidadCarrito}</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>`;
    }

    contenedor.innerHTML = htmlCarrito;

    // Agregar eventos a botones eliminar
    let botonesEliminar = document.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            let id = parseInt(e.target.getAttribute("data-id"));
            eliminarDelCarrito(id);
        });
    });
}

function mostrarPrecioTotal() {
    let htmlTotalCarrito = "";
    let total = 0;
    for (let i = 0; i < arrayCarrito.length; i++) {
        total += arrayCarrito[i].precio * arrayCarrito[i].cantidadCarrito;
    }

    htmlTotalCarrito += `<div class="centrar">
                    <h3>Total: $${total}</h3>
                </div>`;
    document.getElementById("total-carrito").innerHTML = htmlTotalCarrito;
}
function filtrarPorNombre(arrayProductos, textBox) {
    textBox.addEventListener("keyup", function (event) {
        let texto = textBox.value.toLowerCase();
        let productosFiltrados = arrayProductos.filter(producto => producto.nombre.toLowerCase().includes(texto));
        mostrarProductos(productosFiltrados);
    });
}

function buscarProductoPorId(id) {
    for (let i = 0; i < arrayProductos.length; i++) {
        if (arrayProductos[i].id == id) {
            return arrayProductos[i];
        }
    }
}
function agregarAlCarrito(id) {
    // Buscar si el producto ya existe en el carrito
    let productoCarrito = arrayCarrito.find(p => p.id === id);

    if (productoCarrito) {
        // Si ya existe, aumentar la cantidad
        productoCarrito.cantidadCarrito += 1;
    } else {
        // Si no existe, buscar el producto en la lista principal
        let producto = buscarProductoPorId(id);
        // Clonar el producto y agregar propiedad cantidadCarrito = 1
        productoCarrito = {...producto, cantidadCarrito: 1};
        arrayCarrito.push(productoCarrito);
    }

    mostrarCarrito();
    mostrarPrecioTotal();
}

function eliminarDelCarrito(id) {
    // Buscar el producto en el carrito
    for (let i = 0; i < arrayCarrito.length; i++) {
        if (arrayCarrito[i].id === id) {
            // Si la cantidad es mayor a 1, restar uno
            if (arrayCarrito[i].cantidadCarrito > 1) {
                arrayCarrito[i].cantidadCarrito--;
            } else {
                // Si solo hay uno, eliminar el producto del array
                arrayCarrito.splice(i, 1);
            }
            break;
        }
    }
    mostrarCarrito();
    mostrarPrecioTotal();
}


let arrayProductos = [];
let arrayCarrito = [];
const url = 'http://localhost:3000/api';

async function init() {
    arrayProductos = await obtenerDatosProductos();
    let teclasGuardadas = document.getElementById("buscador");

    mostrarProductos(arrayProductos);
    filtrarPorNombre(arrayProductos, teclasGuardadas);
    mostrarCarrito();
}

init();  
