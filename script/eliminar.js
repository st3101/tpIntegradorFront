/* Santiago Leonardi
David Lago */
let getProductForm = document.getElementById("getProduct-form");
let getId_lista = document.getElementById("getId-list");
let botonEliminarProducto = "";
const url = 'http://localhost:3000/api';

getProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
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
            <button id="btn-eliminar" class="btn-actualizar">Eliminar</button>  
        </div>`


        document.getElementById("getId-container").classList.remove("hidden");
        getId_lista.innerHTML = htmlProducto;

        botonEliminarProducto = document.getElementById("btn-eliminar");

        botonEliminarProducto.addEventListener("click", async (event) => {
            eliminarProducto(event, producto);
        });
    } catch (error) {
        console.error(error);
        const contenedor = document.getElementById("getId-container");
        contenedor.classList.remove("hidden");
        contenedor.classList.add("mostrar-producto"); // o cualquier clase que uses para estilo
        getId_lista.innerHTML = `<p class="error">${error.message}</p>`;
    }
});

async function eliminarProducto(event, producto) {
    event.preventDefault();

    let confirmacion = confirm("¿Quieres eliminar el producto?");

    if (!confirmacion) {
        alert("Confrimacion Cancelada");
        return
    }
    let id = producto.id;
    try {
        //Enviamos los datos del formulario a la API
        let respuesta = await fetch(`${url}/productos/${id}`, {
            method: "DELETE"
        });

        let resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(resultado.message)
            getId_lista.innerHTML = "";
            getId_lista.classList.add("hidden");
            ocultarGetIdContainerVacio();
            return true;

        } else {
            console.error("Error:", resultado.message);
            alert("Ocurrio un error al eliminar un producto");
            return false;
        }


    } catch (error) {
        console.error("Error al enviar los datos", error);
        alert("Error al procesar la solicitud");
        return false;
    }
}

function ocultarGetIdContainerVacio() {
    const contenedor = document.getElementById("getId-container");
    const lista = document.getElementById("getId-list");

    if (contenedor && (!lista || lista.innerHTML.trim() === "")) {
        contenedor.classList.add("hidden");
        contenedor.innerHTML = "";
    }
}
