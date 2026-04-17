import * as model from './model.js';
import * as view from './view.js';

let currentProduct = null;

init();

async function init() {

    // Главная
    if (document.getElementById('catalog')) {
        const products = await model.getProducts();

        view.renderProducts(
            products,
            handleAddToCart,
            handleOpenProduct // 🔥 ВАЖНО
        );

        renderMiniCart();
        bindModalEvents(); // 🔥 ВАЖНО
    }

    // Страница корзины
    if (document.getElementById('cartPageItems')) {
        renderCart();
    }

    bindOrderEvents();
}

// ===== POPUP =====
function handleOpenProduct(product) {
    const modal = document.getElementById('modal');

    currentProduct = product; // 🔥 ВАЖНО

    document.getElementById('modalImg').src = `img/${product.image}`;
    document.getElementById('modalTitle').innerText = product.title;
    document.getElementById('modalSubtitle').innerText = product.subtitle;
    document.getElementById('modalPrice').innerText = `$${product.price}`;
    document.getElementById('modalDescription').innerText = product.description;

    modal.classList.add('active');
}

function bindModalEvents() {
    const modal = document.getElementById('modal');
    const close = document.getElementById('modalClose');
    const addBtn = document.getElementById('modalAddToCart'); // 🔥

    if (!modal) return;

    close.onclick = () => modal.classList.remove('active');

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
        }
    });

    // 🔥 ВОТ ГЛАВНОЕ
    addBtn.onclick = () => {
        if (!currentProduct) return;

        model.addToCart(currentProduct);
        renderMiniCart();

        modal.classList.remove('active');
    };
}

// ===== MINI CART =====
function renderMiniCart() {
    view.renderMiniCart(model.getCart());
}

// ===== CART PAGE =====
function renderCart() {
    view.renderCart(
        model.getCart(),
        (id) => {
            model.updateQuantity(id, +1);
            renderCart();
        },
        (id) => {
            model.updateQuantity(id, -1);
            renderCart();
        },
        (id) => {
            model.removeFromCart(id);
            renderCart();
        }
    );
}

// ===== ADD =====
function handleAddToCart(product) {
    model.addToCart(product);
    renderMiniCart(); // 🔥 фикс
}

// ===== ORDER =====
function bindOrderEvents() {
    const btn = document.getElementById('checkoutBtn');
    const submit = document.getElementById('submitOrder');
    const close = document.getElementById('closeOrderModal');

    if (!btn) return;

    btn.onclick = view.openOrderModal;
    close.onclick = view.closeOrderModal;

    submit.onclick = async () => {

        const order = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
        };

        await model.createOrder(order);

        alert("Заказ оформлен!");

        model.clearCart();
        renderCart();
        renderMiniCart();

        view.closeOrderModal();
    };
}