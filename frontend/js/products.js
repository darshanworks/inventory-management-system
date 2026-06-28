const token = localStorage.getItem("token");
let editingProductId = null;
if (!token) {
  window.location.href = "index.html";
}
let allProducts = [];
let currentSearch = "";

let lowStockMode = false;
const API_URL =
  "https://inventory-management-system-production-c6af.up.railway.app/api/products";

const loadSuppliers = async () => {
  try {
    const response = await fetch(
      "https://inventory-management-system-production-c6af.up.railway.app/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const suppliers = await response.json();

    const supplierDropdown = document.getElementById("supplier_id");

    supplierDropdown.innerHTML = `
      <option value="">
        Select Supplier
      </option>
    `;

    suppliers.forEach((supplier) => {
      supplierDropdown.innerHTML += `
        <option value="${supplier.id}">
          ${supplier.name}
        </option>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

// Fetch Products
const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();
    allProducts = products;
    if (!response.ok) {
      console.log(products);

      return;
    }

    applyFilters();
  } catch (error) {
    console.log(error);
  }
};

// Display Products
const displayProducts = (products) => {
  console.log(products);

  const productList = document.getElementById("productList");

  productList.innerHTML = "";

  products.forEach((product) => {
    productList.innerHTML += `
      <div class="bg-white p-6 rounded shadow break-words">

        <h2 class="text-2xl font-bold mb-2">
          ${product.name}
        </h2>

        <p>
          Category: ${product.category}
        </p>

        <p>
          Price: ₹${product.price}
        </p>

        <p>
          <p>
  Quantity: ${product.quantity}
</p>

${
  product.quantity < 5
    ? `
      <span
        class="bg-red-500 text-white px-3 py-1 rounded inline-block mt-2"
      >
        Low Stock
      </span>
    `
    : ""
}
        </p>

        <p>
          Supplier: ${product.supplier_name}
        </p>

         <button
            onclick="editProduct(${product.id})"
            class="bg-blue-500 text-white px-4 py-2 rounded">
            Edit
        </button>

        <button
          onclick="confirmDeleteProduct(${product.id})"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Delete
        </button>

      </div>
    `;
  });
};
// Add Product
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    name: document.getElementById("name").value,

    category: document.getElementById("category").value,

    price: document.getElementById("price").value,

    quantity: document.getElementById("quantity").value,

    supplier_id: document.getElementById("supplier_id").value,
  };

  try {
    const response = await fetch(
      editingProductId ? `${API_URL}/${editingProductId}` : API_URL,
      {
        method: editingProductId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(product),
      },
    );

    if (response.ok) {
      showToast(
        editingProductId
          ? "Product Updated Successfully"
          : "Product Added Successfully",
      );

      fetchProducts();

      document.getElementById("productForm").reset();

      editingProductId = null;

      document.querySelector("#productForm button[type='submit']").innerText =
        "Add Product";
    } else {
      showToast("Failed To Add Product", "error");
    }
  } catch (error) {
    console.log(error);
  }
});

const confirmDeleteProduct = (id) => {
  const confirmed = confirm("Are you sure you want to delete this product?");

  if (confirmed) {
    deleteProduct(id);
  }
};

// Delete Product
const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      showToast("Product Deleted Successfully");

      fetchProducts();
    } else {
      showToast("Failed To Delete Product", "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something Went Wrong", "error");
  }
};

// SEARCH PRODUCTS
document.getElementById("searchInput").addEventListener("input", (e) => {
  currentSearch = e.target.value.toLowerCase();
  lowStockMode = false;
  applyFilters();
});

// LOW STOCK FILTER
document.getElementById("lowStockBtn").addEventListener("click", () => {
  // Clear search
  currentSearch = "";

  document.getElementById("searchInput").value = "";

  // Enable low stock mode
  lowStockMode = true;

  applyFilters();
});

// SHOW ALL PRODUCTS
document.getElementById("showAllBtn").addEventListener("click", () => {
  lowStockMode = false;

  currentSearch = "";

  document.getElementById("searchInput").value = "";

  displayProducts(allProducts);
});

const applyFilters = () => {
  let filteredProducts = [...allProducts];

  // SEARCH FILTER
  if (currentSearch) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(currentSearch);
    });
  }

  // LOW STOCK FILTER
  if (lowStockMode) {
    filteredProducts = filteredProducts.filter((product) => {
      return product.quantity < 5;
    });
  }

  displayProducts(filteredProducts);
};

const editProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();

    const product = products.find((p) => p.id === id);

    document.getElementById("name").value = product.name;

    document.getElementById("category").value = product.category;

    document.getElementById("price").value = product.price;

    document.getElementById("quantity").value = product.quantity;

    document.getElementById("supplier_id").value = product.supplier_id;

    editingProductId = id;

    document.querySelector("#productForm button[type='submit']").innerText =
      "Update Product";
  } catch (error) {
    console.log(error);
  }
};

// INITIAL PAGE LOAD
const initializeProductsPage = async () => {
  await loadSuppliers();

  await fetchProducts();
};

// RUN PAGE
initializeProductsPage();

// AUTO REFRESH
setInterval(async () => {
  await fetchProducts();
}, 2000);
