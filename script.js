// ===== Firebase =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZ8skMwKsoPs3bRRxPa7Z6c5OJ4kX_9nM",
    authDomain: "e-store-cd8b7.firebaseapp.com",
    projectId: "e-store-cd8b7",
    storageBucket: "e-store-cd8b7.firebasestorage.app",
    messagingSenderId: "390174272980",
    appId: "1:390174272980:web:6c115f1907e632fe57ba41"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===== DOM =====
const catalog = document.getElementById('catalog');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');

const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalAddToCart = document.getElementById('modalAddToCart');


// ===== STATE =====
let cart = [];

let currentProduct = null;


// ===== Загрузка товаров =====
async function loadProducts() {

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {
        const product = {
            id: doc.id,
            ...doc.data()
        };

        createProductCard(product);
    });

}

loadProducts();


// ===== Создание карточки =====
function createProductCard(product) {

    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
        <img src="img/${product.image}" alt="">
        <h3>${product.title}</h3>
        <p class="subtitle">${product.subtitle}</p>
        <div class="price-row">
            <span>$${product.price}</span>
            <button class="cart-btn">🛒</button>
        </div>
    `;

    // 🔹 Открытие popup
    card.addEventListener('click', () => {
        modalImg.src = `img/${product.image}`;
        modalTitle.innerText = product.title;
        modalSubtitle.innerText = product.subtitle;
        modalPrice.innerText = `$${product.price}`;
        modalDescription.innerText = product.description;
        currentProduct = product;

        modal.classList.add('active');
    });

    // 🔹 Добавление в корзину
    const cartButton = card.querySelector('.cart-btn');

    cartButton.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product);
    });

    catalog.appendChild(card);
}


// ===== Добавление в корзину =====
function addToCart(product) {

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
}

modalAddToCart.addEventListener('click', () => {
    if (currentProduct) {
        addToCart(currentProduct);
        modal.classList.remove('active');
    }
});



// ===== Рендер корзины =====
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


// ===== Закрытие модалки =====
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