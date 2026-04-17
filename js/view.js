// PRODUCTS
export function renderProducts(products, onAdd, onOpen) {
    const catalog = document.getElementById('catalog');
    if (!catalog) return;

    catalog.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="img/${product.image}">
            <h3>${product.title}</h3>
            <p>${product.subtitle}</p>
            <span>$${product.price}</span>
            <button class="add">🛒</button>
        `;

        card.querySelector('.add').onclick = (e) => {
            e.stopPropagation();
            onAdd(product);
        };

        card.onclick = () => onOpen(product);

        catalog.appendChild(card);
    });
}

// MINI CART
export function renderMiniCart(cart) {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');

    if (!container || !totalEl) return;

    container.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const el = document.createElement('div');
        el.className = 'cart-item';

        el.innerHTML = `
            ${item.title} x${item.quantity}
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;

        container.appendChild(el);
    });

    totalEl.innerText = `Итого: $${total.toFixed(2)}`;
}

// CART PAGE
export function renderCart(cart, onPlus, onMinus, onRemove) {
    const container = document.getElementById('cartPageItems');
    const totalEl = document.getElementById('cartPageTotal');

    if (!container || !totalEl) return;

    container.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const card = document.createElement('div');
        card.className = 'cart-card';

        card.innerHTML = `
            <img src="img/${item.image}">
            <h3>${item.title}</h3>

            <div>
                <button class="minus">-</button>
                x${item.quantity}
                <button class="plus">+</button>
            </div>

            <p>$${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove">Удалить</button>
        `;

        card.querySelector('.plus').onclick = () => onPlus(item.id);
        card.querySelector('.minus').onclick = () => onMinus(item.id);
        card.querySelector('.remove').onclick = () => onRemove(item.id);

        container.appendChild(card);
    });

    totalEl.innerText = `$${total.toFixed(2)}`;
}

// ORDER MODAL
export function openOrderModal() {
    document.getElementById('orderModal')?.classList.add('active');
}

export function closeOrderModal() {
    document.getElementById('orderModal')?.classList.remove('active');
}