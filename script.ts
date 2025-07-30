type Product = {
  name: string;
  category: string;
  price: number;
  image: {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
  };
};

type CartItem = {
  price: number;
  quantity: number;
};

const cart: Record<string, CartItem> = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data: Product[]) => renderProducts(data));

  const modal = document.getElementById("modal") as HTMLElement | null;
  const confirmBtn = document.getElementById("confirm-order") as HTMLButtonElement | null;
  const closeBtn = document.getElementById("close-modal") as HTMLButtonElement | null;
  const newOrderBtn = document.getElementById("new-order") as HTMLButtonElement | null;
  const cartItems = document.getElementById("cart-items") as HTMLElement | null;

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
    const target = e.target as HTMLElement;
    const name = target.dataset.name;
    if (!name) return;

    const action = target.dataset.action;
    if (action === "add") {
      addToCart(name, parseFloat(target.dataset.price!));
    } else if (action === "remove") {
      removeFromCart(name);
    }
  });
});

function renderProducts(products: Product[]) {
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
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.dataset.name && target.dataset.price) {
      addToCart(target.dataset.name, parseFloat(target.dataset.price));
    }
  });
}

function addToCart(name: string, price: number) {
  if (!cart[name]) {
    cart[name] = { price, quantity: 1 };
  } else {
    cart[name].quantity++;
  }
  updateCartDisplay();
}

function removeFromCart(name: string) {
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
  const confirmButton = document.getElementById("confirm-order") as HTMLButtonElement | null;

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
