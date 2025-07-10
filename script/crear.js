/* Santiago Leonardi
David Lago */

const url = 'http://localhost:3000/api';
let altaProductoForm = document.getElementById("altaProducto-form");

altaProductoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    //Obetenemos los datos del formulario 
    let formData = new FormData(event.target);

    //Convertimos los datos del formulario a un objeto de js
    let data = Object.fromEntries(formData.entries());

    //validamos que los datos del formulario existan
    if (!data.nombre || !data.categoria || !data.precio || !data.cantidad || !data.imagen) {
        // Si alguno de los campos del formulario no existe, mandamos un error
        alert("Todos los datos son obligatorios");
        return;
    }
    console.log(data);

    try {
        //Enviamos los datos del formulario a la API
        let respuesta = await fetch(`${url}/productos`, {
            method: 'POST',
            headers: {
                //indicamos el tipo de contenido que estamos enviando
                'Content-Type': 'application/json'
            },
            //convierte la data de un objeto js a string JSON
            body: JSON.stringify(data)
        });

        //Si esta todo ok, mostramos un mensaje de exito
        if (respuesta.ok) {
            console.log(respuesta);

            let resultado = await respuesta.json();

            //Si todo sale bien, mostramos un mensaje de exito
            alert('Producto creado exitosamente!');
            //Reseteamos el formulario
            altaProductoForm.reset();

        } else {
            let error = await respuesta.json();
            console.error('Error al crear el producto:', error.mensaje);
        }

    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al enviar los datos. Por favor, intente nuevamente.');
    }
});


