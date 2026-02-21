const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

let cart = [];

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalPrice = document.getElementById('modalPrice');

const cards = document.querySelectorAll('.product-card');

cards.forEach(card => {

    // 1️⃣ Открытие модалки
    card.addEventListener('click', () => {

        const img = card.querySelector('img').src;
        const title = card.querySelector('h3').innerText;
        const subtitle = card.querySelector('.subtitle').innerText;
        const price = card.querySelector('.price-row span').innerText;

        modalImg.src = img;
        modalTitle.innerText = title;
        modalSubtitle.innerText = subtitle;
        modalPrice.innerText = price;

        modal.classList.add('active');
    });


    // 2️⃣ Добавление в корзину
    const cartButton = card.querySelector('.cart-btn');

    cartButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 🔥 вот ключевая строка
        addToCart(card);
    });

});

function addToCart(card) {

    const title = card.querySelector('h3').innerText;
    const priceText = card.querySelector('.price-row span').innerText;
    const price = parseFloat(priceText.replace('$', ''));

    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            title: title,
            price: price,
            quantity: 1
        });
    }

    renderCart();
}

function renderCart() {

    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <span>${item.title} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerText = `Итого: $${total.toFixed(2)}`;
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('active');
    }
});
