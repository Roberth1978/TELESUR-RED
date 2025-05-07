// Carrito de compras
let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const plan = this.getAttribute('data-plan');
        const price = parseInt(this.getAttribute('data-price'));

        // Verificar si el plan ya está en el carrito
        const existingItem = cart.find(item => item.plan === plan);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                plan: plan,
                price: price,
                quantity: 1
            });
        }

        updateCart();
        alert(`${plan} ha sido agregado al carrito`);
    });
});

function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Tu carrito está vacío</p>';
        cartTotalElement.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.plan}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-price">$${itemTotal}</div>
                <span class="remove-item" data-index="${index}">✕</span>
            </div>
        `;
    });

    cartItemsElement.innerHTML = html;
    document.getElementById('total-amount').textContent = total;
    cartTotalElement.style.display = 'block';
    checkoutBtn.style.display = 'block';

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
        });
    });
}

// Manejo de métodos de pago
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.payment-details').forEach(detail => {
            detail.classList.remove('active');
        });

        const selectedDetails = document.getElementById(`${this.value}-details`);
        if (selectedDetails) {
            selectedDetails.classList.add('active');
        }
    });
});

// Formulario de registro
document.getElementById('service-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        plan: document.getElementById('plan').value,
        direccion: document.getElementById('direccion').value,
        referencias: document.getElementById('referencias').value
    };

    // Aquí normalmente enviarías los datos al servidor
    console.log('Datos del formulario:', formData);
    alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.');
    this.reset();
});

// Botón de pago
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (paymentMethod === 'tarjeta') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;

        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            alert('Por favor completa todos los datos de la tarjeta');
            return;
        }

        // Validación simple de tarjeta
        if (cardNumber.replace(/\s/g, '').length !== 16 || !/^\d+$/.test(cardNumber.replace(/\s/g, ''))) {
            alert('Por favor ingresa un número de tarjeta válido (16 dígitos)');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Por favor ingresa una fecha de expiración válida (MM/AA)');
            return;
        }

        if (cardCvv.length < 3 || !/^\d+$/.test(cardCvv)) {
            alert('Por favor ingresa un CVV válido (3 o 4 dígitos)');
            return;
        }
    }

    // Aquí normalmente procesarías el pago
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Pago procesado por $${total}!\nMétodo: ${paymentMethod === 'tarjeta' ? 'Tarjeta' : 'Efectivo'}\nGracias por tu compra.`);

    // Limpiar carrito
    cart = [];
    updateCart();
});

// Tema oscuro/claro
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');

    // Guardar preferencia en localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Cambiar ícono
    this.textContent = isDarkMode ? '🌞' : '🌓';
});

// Cargar preferencia de tema al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const themeToggle = document.getElementById('theme-toggle');

    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌞';
    } else {
        themeToggle.textContent = '🌓';
    }

    // Animaciones al desplazarse
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;

            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Mostrar elementos al cargar
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});


document.addEventListener('DOMContentLoaded', function() {
    // Resaltar botón activo
    document.querySelectorAll('.location-selector a').forEach(link => {
        if (link.href.includes(currentLocation)) {
            link.classList.add('active');
        }
    });
    
    // Configurar FormSubmit para cada ubicación
    const form = document.getElementById('service-form');
    if (form) {
        form.setAttribute('action', `https://formsubmit.co/rroberth.chavarria+${currentLocation}@gmail.com`);
    }
});
