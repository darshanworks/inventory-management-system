const token = localStorage.getItem("token");
let inventoryChart = null;
let transactionChart = null;
if (!token) {
  window.location.href = "index.html";
}

// FETCH DASHBOARD DATA
const fetchDashboard = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(data);

      return;
    }

    // Stats
    document.getElementById("totalProducts").innerText = data.totalProducts;

    document.getElementById("totalSuppliers").innerText = data.totalSuppliers;

    document.getElementById("totalTransactions").innerText =
      data.totalTransactions;

    document.getElementById("inventoryValue").innerText =
      `₹${data.inventoryValue.toLocaleString()}`;

    document.getElementById("lowStockCount").innerText =
      data.lowStockProducts.length;

    // LOW STOCK PRODUCTS
    const lowStockContainer = document.getElementById("lowStockProducts");

    lowStockContainer.innerHTML = "";

    if (data.lowStockProducts.length === 0) {
      lowStockContainer.innerHTML = `
        <p>No low stock products</p>
      `;
    } else {
      data.lowStockProducts.forEach((product) => {
        lowStockContainer.innerHTML += `
            <div class="border-b py-3">

              <h3 class="font-bold">
                ${product.name}
              </h3>

              <p>
                Quantity:
                ${product.quantity}
              </p>

            </div>
          `;
      });
    }

    // RECENT TRANSACTIONS
  } catch (error) {
    console.log(error);
  }
};

const createInventoryChart = (products) => {
  const labels = products.map((product) => product.name);

  const quantities = products.map((product) => product.quantity);

  const ctx = document.getElementById("inventoryChart").getContext("2d");

  if (inventoryChart) {
    inventoryChart.destroy();
  }

  inventoryChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels,

      datasets: [
        {
          label: "Stock Quantity",

          data: quantities,
        },
      ],
    },

    options: {
      responsive: true,
    },
  });
};

const createTransactionChart = (transactions) => {
  const inCount = transactions.filter((t) => t.type === "IN").length;

  const outCount = transactions.filter((t) => t.type === "OUT").length;

  const ctx = document.getElementById("transactionChart").getContext("2d");
  if (transactionChart) {
    transactionChart.destroy();
  }

  transactionChart = new Chart(ctx, {
    type: "pie",

    data: {
      labels: ["IN", "OUT"],

      datasets: [
        {
          data: [inCount, outCount],
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

const fetchProductsForChart = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const products = await response.json();

    createInventoryChart(products);
  } catch (error) {
    console.log(error);
  }
};

const fetchTransactionsForChart = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const transactions = await response.json();

    createTransactionChart(transactions);
  } catch (error) {
    console.log(error);
  }
};

// FETCH RECENT TRANSACTIONS
const fetchRecentTransactions = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const transactions = await response.json();

    const container = document.getElementById("recentTransactions");

    container.innerHTML = "";

    transactions.slice(0, 5).forEach((transaction) => {
      container.innerHTML += `
  <div class="flex justify-between border-b py-3">

    <div>

      <h3 class="font-semibold">
        ${transaction.product_name}
      </h3>

    </div>

    <div class="text-right">

      <span
        class="${
          transaction.type === "IN" ? "text-green-600" : "text-red-600"
        } font-bold"
      >
        ${transaction.type}
      </span>

      <p>
        Qty:
        ${transaction.quantity}
      </p>

    </div>

  </div>
`;
    });
  } catch (error) {
    console.log(error);
  }
};

// INITIAL LOAD
fetchDashboard();

fetchRecentTransactions();
fetchTransactionsForChart();
fetchProductsForChart();

// AUTO REFRESH
setInterval(() => {
  fetchDashboard();
}, 2000);
