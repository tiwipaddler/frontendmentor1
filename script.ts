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
  
    const confirmBtn = document.getElementById("confirm-order") as HTMLButtonElement;
    const closeBtn = document.getElementById("close-modal") as HTMLButtonElement;
    const newOrderBtn = document.getElementById("new-order") as HTMLButtonElement;
    const cartItems = document.getElementById("cart-items") as HTMLElement;
  
    confirmBtn.addEventListener("click", showModal);
    closeBtn.addEventListener("click", closeModal);
    newOrderBtn.addEventListener("click", resetCart);
  
    // Event delegation for "+" and "-" buttons inside cart items
    cartItems.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const name = target.dataset.name;
      if (!name) return;
  
      const action = target.dataset.action;
      if (action === "add") {
        // Add one more item of this product
        addToCart(name, parseFloat(target.dataset.price!));
      } else if (action === "remove") {
        // Remove one item of this product
        removeFromCart(name);
      }
    });
  
  
  function renderProducts(products: Product[]) {
    const container = document.getElementById("product-list") as HTMLElement;
  
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
  
    // Allow direct adding from product list buttons
    container.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON" && target.dataset.name) {
        addToCart(target.dataset.name, parseFloat(target.dataset.price!));
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
    const cartItems = document.getElementById("cart-items") as HTMLElement;
    const cartCount = document.getElementById("cart-count") as HTMLElement;
    const confirmButton = document.getElementById("confirm-order") as HTMLButtonElement;
  
    cartItems.innerHTML = ""; // Clear current list
    let totalItems = 0;
  
    Object.entries(cart).forEach(([name, item]) => {
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
    });
  
    cartCount.textContent = totalItems.toString();
    confirmButton.disabled = totalItems === 0;
  }
  
  function showModal() {
    const modal = document.getElementById("modal") as HTMLElement;
    modal.classList.remove("hidden");
  }
  
  function closeModal() {
    const modal = document.getElementById("modal") as HTMLElement;
    modal.classList.add("hidden");
    resetCart();
  }
  
  function resetCart() {
    Object.keys(cart).forEach((key) => {
      delete cart[key];
    });
    updateCartDisplay();
  }
});
  