let products = JSON.parse(localStorage.getItem('adminProducts')) || [];

renderProducts();
updateStats();

function saveProducts() {
  localStorage.setItem(
    'adminProducts',
    JSON.stringify(products)
  );
}

function addProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const stock = document.getElementById('productStock').value;
  const category = document.getElementById('productCategory').value;

  if (!name || !price || !stock || !category) {
    alert('Please fill all fields');
    return;
  }

  const product = {
    id: Date.now(),
    name,
    price: Number(price),
    stock: Number(stock),
    category,
  };

  products.push(product);

  saveProducts();
  renderProducts();
  updateStats();

  document.getElementById('productName').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productStock').value = '';
  document.getElementById('productCategory').value = '';
}

function renderProducts() {
  const container = document.getElementById(
    'productsContainer'
  );

  container.innerHTML = products
    .map(
      (product) => `

    <div class="product-card">

      <h4>${product.name}</h4>

      <p>Price: ₦${product.price.toLocaleString()}</p>

      <p>Stock: ${product.stock}</p>

      <p>Category: ${product.category}</p>

      <div class="product-actions">

        <button
          class="increase"
          onclick="increaseStock(${product.id})"
        >
          + Stock
        </button>

        <button
          class="decrease"
          onclick="decreaseStock(${product.id})"
        >
          - Stock
        </button>

        <button
          class="delete"
          onclick="deleteProduct(${product.id})"
        >
}