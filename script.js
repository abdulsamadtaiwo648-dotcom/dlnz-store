// Product Data
const productData = [
  {
    id: 1,
    name: 'Classic DLNZ Hoodie',
    category: 'hoodie',
    price: 18000,
    emoji: '🧥',
    description: 'Premium comfortable hoodie with signature DLNZ branding',
  },
  {
    id: 2,
    name: 'Street Vibes T-Shirt',
    category: 'tshirt',
    price: 9000,
    emoji: '👕',
    description: 'High-quality cotton t-shirt perfect for everyday wear',
  },
  {
    id: 3,
    name: 'Premium DLNZ Jacket',
    category: 'jacket',
    price: 27000,
    emoji: '🧤',
    description: 'Stylish bomber jacket with premium materials',
  },
  {
    id: 4,
    name: 'DLNZ Hoodie Pro',
    category: 'hoodie',
    price: 22000,
    emoji: '🧥',
    description: 'Enhanced version with premium fabric and fit',
  },
  {
    id: 5,
    name: 'Graphic T-Shirt',
    category: 'tshirt',
    price: 12000,
    emoji: '👕',
    description: 'Bold graphic design with comfortable fit',
  },
  {
    id: 6,
    name: 'Winter Jacket Deluxe',
    category: 'jacket',
    price: 35000,
    emoji: '🧤',
    description: 'Insulated winter jacket with water resistance',
  },
];

let cart = [];
let currentFilter = 'all';
let currentSort = 'default';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderProducts();
  updateCart();
  setupFormSubmit();
});

// Render Products
function renderProducts() {
  const filteredProducts = filterProductsByCategory(productData, currentFilter);
  const sortedProducts = sortProductsList(filteredProducts, currentSort);

  const productsContainer = document.getElementById('productsContainer');
  const emptyState = document.getElementById('emptyState');

  if (sortedProducts.length === 0) {
    productsContainer.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  productsContainer.innerHTML = sortedProducts
    .map(
      (product) => `
    <div class="card" data-id="${product.id}">
      <div class="card-image">${product.emoji}</div>
      <span class="category">${product.category}</span>
      <h3>${product.name}</h3>
      <p class="description">${product.description}</p>
      <div class="price">₦${product.price.toLocaleString()}</div>
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
        Add to Cart
      </button>
    </div>
  `
    )
    .join('');
}

// Filter Products
function filterProducts(category) {
  currentFilter = category;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  renderProducts();
}

function filterProductsByCategory(products, category) {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

// Sort Products
function sortProducts(sortType) {
  currentSort = sortType;
  renderProducts();
}

function sortProductsList(products, sortType) {
  const sorted = [...products];

  switch (sortType) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

// Add to Cart
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCartToStorage();
  updateCart();
  showNotification(`${name} added to cart!`);
}

// Update Cart Display
function updateCart() {
  const cartCount = document.getElementById('cartCount');
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutForm = document.getElementById('checkoutForm');

  cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    emptyCart.style.display = 'block';
    checkoutForm.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  checkoutForm.style.display = 'flex';

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₦${item.price.toLocaleString()} x ${item.quantity}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `
    )
    .join('');

  calculateTotals();
}

// Calculate Totals
function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000; // Free shipping over ₦50,000
  const total = subtotal + shipping;

  document.getElementById('subtotal').innerText = subtotal.toLocaleString();
  document.getElementById('shipping').innerText = shipping.toLocaleString();
  document.getElementById('total').innerText = total.toLocaleString();
}

// Remove from Cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCartToStorage();
  updateCart();
}

// Open/Close Cart
function openCart() {
  const cartModal = document.getElementById('cart');
  const overlay = document.getElementById('cartOverlay');
  cartModal.classList.add('open');
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const cartModal = document.getElementById('cart');
  const overlay = document.getElementById('cartOverlay');
  cartModal.classList.remove('open');
  overlay.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Setup Form Submission
function setupFormSubmit() {
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', handleCheckout);
}

// Handle Checkout
function handleCheckout(e) {
  e.preventDefault();

  // Validate form
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();

  if (!name || !email || !phone || !address) {
    showError('Please fill in all fields');
    return;
  }

  if (!validateEmail(email)) {
    showError('Please enter a valid email address');
    return;
  }

  if (!validatePhone(phone)) {
    showError('Please enter a valid phone number');
    return;
  }

  if (cart.length === 0) {
    showError('Your cart is empty');
    return;
  }

  // Process Order
  const total = document.getElementById('total').innerText;
  const orderMessage = `
Order Summary:
Customer: ${name}
Email: ${email}
Phone: ${phone}
Delivery Address: ${address}
Total Amount: ₦${total}

Your order has been confirmed! We'll contact you soon with delivery details.
  `.trim();

  document.getElementById('orderMessage').innerText = orderMessage;
  showSuccessModal();

  // Reset form and cart
  resetCheckout();
}

// Validation Functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[\d+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Reset Checkout
function resetCheckout() {
  document.getElementById('checkoutForm').reset();
  cart = [];
  saveCartToStorage();
  updateCart();
  closeCart();
}

// Show Success Modal
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.add('open');
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('open');
}

// Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 999;
    animation: slideIn 0.3s ease;
    font-weight: bold;
  `;
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function showError(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 999;
    animation: slideIn 0.3s ease;
    font-weight: bold;
  `;
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Local Storage Functions
function saveCartToStorage() {
  localStorage.setItem('dlnzCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem('dlnzCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Add animations to document
const style = document.createElement('style');
style.innerText = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
