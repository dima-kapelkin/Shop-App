import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = { 
    apiKey: "AIzaSyDZ8skMwKsoPs3bRRxPa7Z6c5OJ4kX_9nM",
    authDomain: "e-store-cd8b7.firebaseapp.com",
    projectId: "e-store-cd8b7",
    storageBucket: "e-store-cd8b7.appspot.com", 
    messagingSenderId: "390174272980", 
    appId: "1:390174272980:web:6c115f1907e632fe57ba41" 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== PRODUCTS =====
export async function getProducts() {
    const snapshot = await getDocs(collection(db, "products"));

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

// ===== CART =====
export function getCart() {
    return cart;
}

export function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
}

export function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart();
}

export function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ===== ORDER =====
export async function createOrder(orderData) {
    return await addDoc(collection(db, "orders"), {
        ...orderData,
        items: cart,
        createdAt: new Date()
    });
}

export function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
}