function realizarPago() {
    // Obtener el carrito del almacenamiento local
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe y no está vacío
    if (carrito && carrito !== '{}') {
        // Crear un objeto FormData para enviar los datos del formulario
        let formData = new FormData();
        formData.append('carrito', carrito);
        formData.append('nombre_producto', 'Nombre del producto'); // Reemplaza con el nombre del producto adecuado
        formData.append('cantidad_productos', 1); // Reemplaza con la cantidad adecuada
        formData.append('total', 10.99); // Reemplaza con el total adecuado
        
        // Enviar la información del carrito al servidor
        fetch(guardarVentaUrl, {
            method: 'POST',
            headers: {
              'X-CSRFToken': csrfToken
            },
            body: formData
          })
            .then(response => response.json())
            .then(data => {
              // Resto del código
            })
            .catch(error => {
              // Resto del código
            })
          
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            if (data.message) {
                // La venta se guardó correctamente
                alert(data.message);

                // Vaciar el carrito en el almacenamiento local
                localStorage.removeItem('carrito');

                // Actualizar la vista del carrito
                actualizarVistaCarrito();
            } else if (data.error) {
                // Hubo un error al guardar la venta
                alert(data.error);
            }
        })
        .catch(error => {
            // Manejar los errores de la solicitud
            console.error('Error al realizar el pago:', error);
        });
    } else {
        // El carrito está vacío, mostrar mensaje de error
        alert('El carrito está vacío. Agrega productos antes de realizar el pago.');
    }
}

function agregarAlCarrito(nombre, precio) {
    // Obtener el carrito del almacenamiento local
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe
    if (carrito && carrito !== '{}') {
        // Convertir el carrito de JSON a objeto JavaScript
        carrito = JSON.parse(carrito);
    } else {
        // Si el carrito no existe, inicializarlo como un objeto vacío
        carrito = {};
    }

    // Verificar si el producto ya está en el carrito
    if (nombre in carrito) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        carrito[nombre].cantidad += 1;
    } else {
        // Si el producto no está en el carrito, agregarlo con una cantidad de 1
        carrito[nombre] = {
            precio: precio,
            cantidad: 1
        };
    }

    // Guardar el carrito actualizado en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar la vista del carrito
    actualizarVistaCarrito();
}

function eliminarDelCarrito(nombre) {
    // Obtener el carrito del almacenamiento local
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe
    if (carrito && carrito !== '{}') {
        // Convertir el carrito de JSON a objeto JavaScript
        carrito = JSON.parse(carrito);

        // Verificar si el producto está en el carrito
        if (nombre in carrito) {
            // Eliminar el producto del carrito
            delete carrito[nombre];

            // Guardar el carrito actualizado en el almacenamiento local
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Actualizar la vista del carrito
            actualizarVistaCarrito();
        }
    }
}

function agregarProductoMas(nombre) {
    // Obtener el carrito del almacenamiento local
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe
    if (carrito && carrito !== '{}') {
        // Convertir el carrito de JSON a objeto JavaScript
        carrito = JSON.parse(carrito);

        // Verificar si el producto está en el carrito
        if (nombre in carrito) {
            // Incrementar la cantidad del producto en 1
            carrito[nombre].cantidad += 1;

            // Guardar el carrito actualizado en el almacenamiento local
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Actualizar la vista del carrito
            actualizarVistaCarrito();
        }
    }
}

function actualizarVistaCarrito() {
    // Obtener el contenedor del carrito
    let contenedorCarrito = document.getElementById('contenedor-carrito');

    // Obtener el carrito del almacenamiento local
    let carrito = localStorage.getItem('carrito');

    // Verificar si el carrito existe y no está vacío
    if (carrito && carrito !== '{}') {
        // Convertir el carrito de JSON a objeto JavaScript
        carrito = JSON.parse(carrito);

        // Crear el contenido HTML del carrito
        let contenidoHTML = '';
        let total = 0;

        // Recorrer los productos del carrito y generar el HTML correspondiente
        for (let producto in carrito) {
            let cantidad = carrito[producto].cantidad;
            let subtotal = carrito[producto].precio * cantidad;

            contenidoHTML += `<div class="producto-carrito">
                                <h5>${producto}</h5>
                                <p>Cantidad: ${cantidad}</p>
                                <p>Precio: ${subtotal}</p>
                                <button class="btn-eliminar" onclick="eliminarDelCarrito('${producto}')">Eliminar</button>
                                <button class="btn-agregar-mas" onclick="agregarProductoMas('${producto}')">Agregar 1 más</button>
                            </div>`;

            total += subtotal;
        }

        // Insertar el contenido HTML en el contenedor del carrito
        let productosCarrito = document.getElementById('carrito-productos');
        productosCarrito.innerHTML = contenidoHTML;

        // Mostrar el total del carrito
        let totalCarrito = document.getElementById('carrito-total');
        totalCarrito.textContent = 'Total: $' + total.toFixed(2);

        // Ocultar el mensaje de carrito vacío
        let carritoVacio = document.getElementById('carrito-vacio');
        carritoVacio.style.display = 'none';

        // Mostrar el botón de pago
        let botonPago = document.getElementById('boton-pago');
        botonPago.style.display = 'block';
    } else {
        // Si el carrito no existe o está vacío, mostrar el mensaje de carrito vacío y ocultar el total y el botón de pago
        let carritoVacio = document.getElementById('carrito-vacio');
        carritoVacio.style.display = 'block';

        let totalCarrito = document.getElementById('carrito-total');
        totalCarrito.textContent = '';

        let botonPago = document.getElementById('boton-pago');
        botonPago.style.display = 'none';

        // Vaciar el contenedor de productos del carrito
        let productosCarrito = document.getElementById('carrito-productos');
        productosCarrito.innerHTML = '';
    }
}

// Llamar a la función actualizarVistaCarrito al cargar la página
window.addEventListener('load', actualizarVistaCarrito);
