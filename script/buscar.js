/* Santiago Leonardi
David Lago */

const url = 'http://localhost:3000/api';

let getProductForm = document.getElementById("getProduct-form");
let contenedor = document.getElementById("getId-container");
let getId_lista = document.getElementById("getId-list");

//Simula una espera de 1 segundo para mostrar el mensaje de "Cargando producto..."
function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
getProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        contenedor.classList.remove('hidden');
        getId_lista.innerHTML = "Cargando producto...";
        await esperar(1000); // Espera 1 segundo
        //Creamos un objeto FormData para obtener los datos del formulario de event.target
        let formData = new FormData(event.target);

        //Tansformamos el objeto FormData a un objeto normal que ya posee la id del producto
        let data = Object.fromEntries(formData.entries());

        //Obtenemos el id del producto desde el objeto data y le sacamos los espacios en blanco al principio y al final del formulario (En nuestro caso no es necesario, pero es una buena práctica)
        let idProd = data.idProd.trim();

        //Validacion 1
        if (!idProd) {
            // Si el id del formulario no existe, mandamos un error
            throw new Error(`Error en el envio de datos del formulario`);
        }

        //Traemos el producto desde la API usando el id del producto
        let respuesta = await fetch(`${url}/productos/${idProd}`);

        //Tranformamos el texto a formato JSON
        let datos = await respuesta.json();

        //Validacion 2
        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error("No se encontró ningún producto con ese ID");
            } else {
                throw new Error(`Status: ${respuesta.status} StatusText: ${respuesta.statusText}`);
            }
        }

        //Validacion 3
        if (!datos.payload || datos.payload.length === 0) {
            // Si no hay productos en el payload, mandamos un error
            throw new Error(`No se encontraron productos con el ID: ${idProd}`);
        }

        //Del JSON obtenido, accedemos al primer elemento del array payload que es el producto que buscamos
        let producto = datos.payload[0];

        let htmlProducto = `
        <div class="tarjeta-producto">
            <h2>${producto.nombre}</h2>
            <img src="${producto.imagen}" class="img-listados">
            <p>Precio: $${producto.precio}</p>
        </div>`

        document.getElementById('getId-container').classList.remove('hidden');

        getId_lista.innerHTML = htmlProducto;
    } catch (error) {
        console.error(error);

        document.getElementById('getId-container').classList.remove('hidden');
        //Mensaje de error en caso de que algo falle en el html
        getId_lista.innerHTML = `<p class="error">${error.message}</p>`;
    }
});