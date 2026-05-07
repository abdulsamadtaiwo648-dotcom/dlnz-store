let products = [];

// -----------------------------
// INIT
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

// -----------------------------
// LOAD PRODUCTS (REALTIME FIRESTORE)
// -----------------------------
function loadProducts() {
  const ref = window.fb.collection(window.db, "products");

  window.fb.onSnapshot(ref, (snapshot) => {
    products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderProducts();
    updateStats();
  });
}

// -----------------------------
// ADD PRODUCT
// -----------------------------
async function addProduct() {
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const stock = document.getElementById('productStock').value;
  const category = document.getElementById('productCategory').value;
  const emoji = document.getElementById('productEmoji')?.value || "📦";
  const description = document.getElementById('productDescription')?.value || "";

  if (!name || !price || !stock || !category) {
    alert('Please fill all required fields');
    return;
  }

  try {
    await window.fb.addDoc(
      window.fb.collection(window.db, "products"),
      {
        name,
        price: Number(price),
        stock: Number(stock),
        category,
        emoji,
        description
      }
    );

    alert("Product added successfully!");

    // clear form
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productCategory').value = '';
    if (document.getElementById('productEmoji')) {
      document.getElementById('productEmoji').value = '';
    }
    if (document.getElementById('productDescription')) {
      document.getElementById('productDescription').value = '';
    }

  } catch (err) {
    console.error(err);
    alert("Error adding product");
  }
}

// -----------------------------
// DELETE PRODUCT
// -----------------------------
function deleteProduct(id) {
  window.fb.deleteDoc(
    window.fb.doc(window.db, "products", id)
  );
}

// -----------------------------
// UPDATE STOCK
// -----------------------------
function increaseStock(id) {
  const product = products.find(p => p.id === id);

  window.fb.updateDoc(
    window.fb.doc(window.db, "products", id),
    {
      stock: (product.stock || 0) + 1
    }
  );
}

function decreaseStock(id) {
  const product = products.find(p => p.id === id);

  if (!product || product.stock <= 0) return;

  window.fb.updateDoc(
    window.fb.doc(window.db, "products", id),
    {
      stock: product.stock - 1
    }
  );
}

// -----------------------------
// RENDER PRODUCTS
// -----------------------------
function renderProducts() {
  const container = document.getElementById('productsContainer');

  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card">

      <div style="font-size:30px">
        ${product.emoji || "📦"}
      </div>

      <h4>${product.name}</h4>

      <p>Price: ₦${Number(product.price).toLocaleString()}</p>
      <p>Stock: ${product.stock}</p>
      <p>Category: ${product.category}</p>

      <p style="font-size:12px; opacity:0.7">
        ${product.description || ""}
      </p>

      <div class="product-actions">
        <button onclick="increaseStock('${product.id}')">+ Stock</button>
        <button onclick="decreaseStock('${product.id}')">- Stock</button>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
      </div>

    </div>
  `).join('');
}

// -----------------------------
// STATS
// -----------------------------
function updateStats() {
  const totalProducts = document.getElementById('totalProducts');
  const totalStock = document.getElementById('totalStock');

  if (totalProducts) {
    totalProducts.innerText = products.length;
  }

  if (totalStock) {
    totalStock.innerText = products.reduce(
      (sum, p) => sum + (p.stock || 0),
      0
    );
  }
}