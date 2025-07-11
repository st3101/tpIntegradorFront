/* Santiago Leonardi
David Lago */

    const url = 'http://localhost:3000/api';
    let getProductForm = document.getElementById("getProduct-form");
    let getId_lista = document.getElementById("getId-list");
    let getAltaProductoForm = document.getElementById("actualizarProductoForm-container");
    let botonActualizar = "";
    let enviarProductoForm = "";

    getProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const contenedor = document.getElementById("getId-container");
            const getId_lista = document.getElementById("getId-list");

            contenedor.classList.remove('hidden');
            contenedor.classList.add('mostrar-producto');

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
                <button id="btn-actualizar" class="btn-actualizar">Actualizar</button>
            </div>`

            contenedor.classList.remove("hidden");
            contenedor.classList.add("mostrar-producto");
            getId_lista.innerHTML = htmlProducto;
            getProductForm.reset();

            botonActualizar = document.getElementById("btn-actualizar");

            botonActualizar.addEventListener("click", async (event) => {
                formularioProducto(event, producto);
            });


        } catch (error) {
            console.error(error);
            const contenedor = document.getElementById("getId-container");
            const getId_lista = document.getElementById("getId-list");
            contenedor.classList.remove("hidden");
            contenedor.classList.add("mostrar-producto");
            getId_lista.innerHTML = `<p class="error">${error.message}</p>`;
        }
    });

    function formularioProducto(event, producto) {
        event.stopPropagation();

        getAltaProductoForm = document.getElementById("actualizarProductoForm-container");
        getAltaProductoForm.classList.remove("hidden");
        getAltaProductoForm.classList.add("visible");

        getAltaProductoForm.innerHTML = `
                <h2>Producto</h2>
                <form id="altaProducto-form" autocomplete="off">
                    <!-- Nombre -->
                    <label for="text">Nombre</label>
                    <input type="text" name="nombre" id="nombre" value="${producto.nombre}" required>

                    <!-- Categoria -->
                    <label for="text">Categoria</label>
                    <select name="categoria" id="categoria" required value="${producto.categoria}">
                        <option value="Aventura">Aventura</option>
                        <option value="Accion">Acción</option>
                    </select>

                    <!-- Precio -->
                    <label for="text">Precio</label>
                    <input type="number" name="precio" id="precio" required value="${producto.precio}">

                    <!-- Cantidad -->
                    <label for="text">Cantidad</label>
                    <input type="number" name="cantidad" id="cantidad" required value="${producto.cantidad}">

                    <!-- Imagen -->
                    <label for="text">Imagen</label>
                    <input type="text" name="imagen" id="imagen" required value="${producto.imagen}">

                    <!-- Enviar -->
                    <input type="submit" value="Actualizar Producto">
                </form>
                `;
        enviarProductoForm = document.getElementById("altaProducto-form");

        enviarProductoForm.addEventListener("submit", (event) => {
            actualizarProducto(event, producto);
        });
    }

    async function actualizarProducto(event, producto) {
        event.preventDefault();

        //Creamos un objeto FormData para obtener los datos del formulario de event.target
        let formData = new FormData(event.target);

        //Tansformamos el objeto FormData a un objeto js
        let data = Object.fromEntries(formData.entries());

        //Validamos que los datos del formulario existan
        if (!data.nombre || !data.imagen || !data.precio || !data.cantidad || !data.categoria) {
            alert("Todos los campos son obligatorios");
            return;
        }
        //Agregamos al formulario ACTUALIZADO el id del PRODUCTO
        data.id = producto.id;

        console.table(data);

        try {
            //Enviamos los datos del formulario a la API
            let respuesta = await fetch(`${url}/productos`, {
                method: 'PUT',
                headers: {
                    //indicamos el tipo de contenido que estamos enviando
                    'Content-Type': 'application/json'
                },
                //convierte la data de un objeto js a string JSON
                body: JSON.stringify(data)
            });


            if (respuesta.ok) {
                console.log(respuesta);

                let resultado = await respuesta.json()
                console.log(resultado.message);
                alert(resultado.message);

                //Vaciamos el formulario si todo funciono 
                document.getElementById("getId-container").classList.add("hidden");
                document.getElementById("getId-container").classList.remove("mostrar-producto");
                document.getElementById("getId-list").innerHTML = "";

                getAltaProductoForm.classList.add("hidden");
                getAltaProductoForm.classList.remove("visible");
                getAltaProductoForm.innerHTML = "";
            }
        } catch (error) {
            console.error("Error al enviar los datos", error);
            alert("Error al procesar la solicitud");
        }
    }