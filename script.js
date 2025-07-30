"use strict";
const cart = {};
document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
        .then((res) => res.json())
        .then((data) => renderProducts(data));
    const modal = document.getElementById("modal");
    const confirmBtn = document.getElementById("confirm-order");
    const closeBtn = document.getElementById("close-modal");
    const newOrderBtn = document.getElementById("new-order");
    const cartItems = document.getElementById("cart-items");
    if (!modal || !confirmBtn || !closeBtn || !newOrderBtn || !cartItems) {
        console.error("One or more required elements not found in DOM");
        return;
    }
    // Ensure modal is hidden on load
    modal.classList.add("hidden");
    confirmBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
        resetCart();
    });
    newOrderBtn.addEventListener("click", resetCart);
    cartItems.addEventListener("click", (e) => {
        const target = e.target;
        const name = target.dataset.name;
        if (!name)
            return;
        const action = target.dataset.action;
        if (action === "add") {
            addToCart(name, parseFloat(target.dataset.price));
        }
        else if (action === "remove") {
            removeFromCart(name);
        }
    });
});
function renderProducts(products) {
    const container = document.getElementById("product-list");
    if (!container) {
        console.error("#product-list element not found");
        return;
    }
    container.innerHTML = ""; // Clear any pre-existing content
    products.forEach((product) => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
      <img src="${product.image.thumbnail}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p>$${product.price.toFixed(2)}</p>
      <button type="button" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
    `;
        container.appendChild(div);
    });
    container.addEventListener("click", (e) => {
        const target = e.target;
        if (target.tagName === "BUTTON" && target.dataset.name && target.dataset.price) {
            addToCart(target.dataset.name, parseFloat(target.dataset.price));
        }
    });
}
function addToCart(name, price) {
    if (!cart[name]) {
        cart[name] = { price, quantity: 1 };
    }
    else {
        cart[name].quantity++;
    }
    updateCartDisplay();
}
function removeFromCart(name) {
    if (cart[name]) {
        cart[name].quantity--;
        if (cart[name].quantity <= 0) {
            delete cart[name];
        }
        updateCartDisplay();
    }
}
function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const confirmButton = document.getElementById("confirm-order");
    if (!cartItems || !cartCount || !confirmButton) {
        console.error("Required cart elements not found");
        return;
    }
    cartItems.innerHTML = "";
    let totalItems = 0;
    for (const name in cart) {
        if (Object.prototype.hasOwnProperty.call(cart, name)) {
            const item = cart[name];
            totalItems += item.quantity;
            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
        <span>${name} x ${item.quantity}</span>
        <span>
          <button type="button" data-action="add" data-name="${name}" data-price="${item.price}">+</button>
          <button type="button" data-action="remove" data-name="${name}">-</button>
        </span>
      `;
            cartItems.appendChild(li);
        }
    }
    cartCount.textContent = totalItems.toString();
    confirmButton.disabled = totalItems === 0;
}
function resetCart() {
    for (const key in cart) {
        if (Object.prototype.hasOwnProperty.call(cart, key)) {
            delete cart[key];
        }
    }
    updateCartDisplay();
}
