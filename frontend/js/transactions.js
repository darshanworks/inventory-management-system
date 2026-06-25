const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const API_URL = "http://localhost:5000/api/transactions";

// LOAD PRODUCTS
const loadProducts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();

    const dropdown = document.getElementById("product_id");

    dropdown.innerHTML = `
      <option value="">
        Select Product
      </option>
    `;

    products.forEach((product) => {
      dropdown.innerHTML += `
        <option value="${product.id}">
          ${product.name}
        </option>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

// FETCH TRANSACTIONS
const fetchTransactions = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const transactions = await response.json();

    displayTransactions(transactions);
  } catch (error) {
    console.log(error);
  }
};

// DISPLAY TRANSACTIONS
const displayTransactions = (transactions) => {
  const transactionList = document.getElementById("transactionList");

  transactionList.innerHTML = "";

  transactions.forEach((transaction) => {
    transactionList.innerHTML += `
      <div class="bg-white p-6 rounded shadow">

        <h2 class="text-2xl font-bold mb-2">
          ${transaction.product_name}
        </h2>

        <p>
          Type: ${transaction.type}
        </p>

        <p>
          Quantity: ${transaction.quantity}
        </p>

      </div>
    `;
  });
};

// ADD TRANSACTION
document
  .getElementById("transactionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const transaction = {
      product_id: document.getElementById("product_id").value,

      type: document.getElementById("type").value,

      quantity: document.getElementById("quantity").value,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(transaction),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        showToast("Transaction Recorded Successfully");

        // Reload transactions
        fetchTransactions();

        // Reload products dropdown
        loadProducts();

        // Reset form
        document.getElementById("transactionForm").reset();

        // IMPORTANT
        // Refresh products page data in background
        localStorage.setItem("productsUpdated", Date.now());
      } else {
        showToast("Failed To Record Transaction", "error");
      }
    } catch (error) {
      console.log(error);

      showToast("Something Went Wrong", "error");
    }
  });

document.getElementById("exportBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/transactions/export",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.xlsx";

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  }
});

document.getElementById("exportPdfBtn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/transactions/export-pdf",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
  }
});
// INITIAL LOAD
const initializeTransactionsPage = async () => {
  await loadProducts();

  await fetchTransactions();
};

// RUN ON PAGE LOAD
initializeTransactionsPage();

// AUTO REFRESH
setInterval(() => {
  fetchTransactions();
}, 2000);
