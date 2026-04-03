import { addDoc, collection } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartPageItems = document.getElementById('cartPageItems');
const cartPageTotal = document.getElementById('cartPageTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const submitOrder = document.getElementById('submitOrder');

function renderCartPage() {

    cartPageItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        const card = document.createElement('div');
        card.classList.add('cart-card');

        card.innerHTML = `
            <img src="img/${item.image || 'placeholder.png'}">
            <h3>${item.title}</h3>

            <div class="cart-controls">
                <button class="minus">-</button>
                <span>x${item.quantity}</span>
                <button class="plus">+</button>
            </div>

            <p>$${(item.price * item.quantity).toFixed(2)}</p>

            <button class="remove">Удалить</button>
        `;

        // ➕
        card.querySelector('.plus').addEventListener('click', () => {
            item.quantity++;
            saveAndRender();
        });

        // ➖
        card.querySelector('.minus').addEventListener('click', () => {
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== item.id);
            }
            saveAndRender();
        });

        // ❌
        card.querySelector('.remove').addEventListener('click', () => {
            cart = cart.filter(i => i.id !== item.id);
            saveAndRender();
        });

        cartPageItems.appendChild(card);
    });

    cartPageTotal.innerText = `$${total.toFixed(2)}`;
}

renderCartPage();

function saveAndRender() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
}

checkoutBtn.addEventListener('click', () => {
    orderModal.classList.add('active');
});

closeOrderModal.addEventListener('click', () => {
    orderModal.classList.remove('active');
});



submitOrder.addEventListener('click', async () => {

    const order = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        items: cart,
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, "orders"), order);

        alert("Заказ успешно оформлен!");

        localStorage.removeItem('cart');
        cart = [];
        renderCartPage();

        orderModal.classList.remove('active');

    } catch (error) {
        console.error("Ошибка:", error);
    }

});

localStorage.removeItem('cart')