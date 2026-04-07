function agregarAlCarrito(nombre, precio, cantidad = 1) {
    let carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];

    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    localStorage.setItem('veciCarrito', JSON.stringify(carrito));

    actualizarContadorCarrito();

    alert(`✅ "${nombre}" agregado al carrito (Cantidad: ${cantidad})`);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];
    const contador = document.getElementById('contador-carrito');

    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

function cargarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalTxt = document.getElementById('precio-total');
    const templateVacio = document.getElementById('carrito-vacio-template');
    const templateItem = document.getElementById('item-carrito-template');
    const carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];

    if (lista) lista.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        if (lista && templateVacio) {
            const clone = templateVacio.content.cloneNode(true);
            lista.appendChild(clone);
        }
        if (totalTxt) totalTxt.innerText = "$0";
        return;
    }

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        if (lista && templateItem) {
            const clone = templateItem.content.cloneNode(true);
            clone.querySelector('[data-nombre]').textContent = item.nombre;
            clone.querySelector('[data-cantidad-precio]').textContent = `$${item.precio.toLocaleString()} c/u`;
            clone.querySelector('[data-subtotal]').textContent = `$${subtotal.toLocaleString()}`;

            const cantInput = clone.querySelector('[data-cantidad]');
            cantInput.value = item.cantidad;
            cantInput.dataset.index = index;
            cantInput.dataset.nombre = item.nombre;

            cantInput.addEventListener('change', function() {
                actualizarCantidadInput(this);
            });

            const btns = clone.querySelectorAll('.btn-cantidad');
            btns.forEach(btn => {
                btn.dataset.index = index;
                btn.dataset.nombre = item.nombre;
            });

            lista.appendChild(clone);
        }
    });

    if (totalTxt) totalTxt.innerText = `$${total.toLocaleString()}`;
}

function actualizarCantidadInput(input) {
    const nombre = input.dataset.nombre;
    let cantidad = parseInt(input.value) || 0;
    let carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];

    const producto = carrito.find(item => item.nombre === nombre);

    if (cantidad === 0) {
        carrito = carrito.filter(item => item.nombre !== nombre);
        localStorage.setItem('veciCarrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
    } else if (cantidad > 0 && producto) {
        producto.cantidad = cantidad;
        localStorage.setItem('veciCarrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

function incrementarCantidad(boton) {
    const cantInput = boton.parentElement.querySelector('input[data-cantidad]');
    const nombre = cantInput.dataset.nombre;
    let carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];

    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        producto.cantidad += 1;
        localStorage.setItem('veciCarrito', JSON.stringify(carrito));
        cargarCarrito();
        actualizarContadorCarrito();
    }
}

function decrementarCantidad(boton) {
    const cantInput = boton.parentElement.querySelector('input[data-cantidad]');
    const nombre = cantInput.dataset.nombre;
    let carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];

    const producto = carrito.find(item => item.nombre === nombre);
    if (producto) {
        if (producto.cantidad > 0) {
            producto.cantidad -= 1;
            localStorage.setItem('veciCarrito', JSON.stringify(carrito));

            if (producto.cantidad === 0) {
                carrito = carrito.filter(item => item.nombre !== nombre);
                localStorage.setItem('veciCarrito', JSON.stringify(carrito));
            }

            cargarCarrito();
            actualizarContadorCarrito();
        }
    }
}

function vaciarCarrito() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem('veciCarrito');
        cargarCarrito();
        if (typeof actualizarContadorCarrito === 'function') actualizarContadorCarrito();
    }
}

function enviarPedidoWhatsApp() {
    const carrito = JSON.parse(localStorage.getItem('veciCarrito')) || [];
    if (carrito.length === 0) return alert("El carrito está vacío");

    let mensaje = "¡Hola VeciGol!  Quiero realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString()}\n`;
        total += item.precio * item.cantidad;
    });

    mensaje += `\n*Total a pagar: $${total.toLocaleString()}*`;

    const tel = "573143415480";
    const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarContadorCarrito();
});