const token = localStorage.getItem("token");
let editingSupplierId = null;
if (!token) {
  window.location.href = "index.html";
}

const API_URL = `${BASE_URL}/api/suppliers`;

// Fetch Suppliers
const fetchSuppliers = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const suppliers = await response.json();

    if (!response.ok) {
      console.log(suppliers);

      return;
    }

    displaySuppliers(suppliers);
  } catch (error) {
    console.log(error);
  }
};

// Display Suppliers
const displaySuppliers = (suppliers) => {
  const supplierList = document.getElementById("supplierList");

  supplierList.innerHTML = "";

  suppliers.forEach((supplier) => {
    supplierList.innerHTML += `
      <div class="bg-white p-6 rounded shadow break-words">

        <h2 class="text-2xl font-bold mb-2">
          ${supplier.name}
        </h2>

        <p>
          Phone: ${supplier.phone}
        </p>

        <p>
          Email: ${supplier.email}
        </p>

        <p>
          Address: ${supplier.address}
        </p>

        <button
          onclick="editSupplier(${supplier.id})"
          class="bg-blue-500 text-white px-4 py-2 rounded">
            Edit
        </button>

        <button
          onclick="confirmDeleteSupplier(${supplier.id})"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4">
            Delete
        </button>

      </div>
    `;
  });
};

// Add Supplier
document
  .getElementById("supplierForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const supplier = {
      name: document.getElementById("name").value,

      phone: document.getElementById("phone").value,

      email: document.getElementById("email").value,

      address: document.getElementById("address").value,
    };

    try {
      const response = await fetch(
        editingSupplierId ? `${API_URL}/${editingSupplierId}` : API_URL,
        {
          method: editingSupplierId ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(supplier),
        },
      );

      if (response.ok) {
        showToast(
          editingSupplierId
            ? "Supplier Updated Successfully"
            : "Supplier Added Successfully",
        );

        fetchSuppliers();

        document.getElementById("supplierForm").reset();

        localStorage.setItem("suppliersUpdated", Date.now());

        editingSupplierId = null;

        document.querySelector(
          "#supplierForm button[type='submit']",
        ).innerText = "Add Supplier";
      } else {
        showToast(
          editingSupplierId
            ? "Failed To Update Supplier"
            : "Failed To Add Supplier",
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    }
  });

const confirmDeleteSupplier = (id) => {
  const confirmed = confirm("Are you sure you want to delete this supplier?");

  if (confirmed) {
    deleteSupplier(id);
  }
};

const deleteSupplier = async (id) => {
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
      showToast("Supplier Deleted Successfully");

      fetchSuppliers();
    } else {
      showToast("Failed To Delete Supplier", "error");
    }
  } catch (error) {
    console.log(error);

    showToast("Something Went Wrong", "error");
  }
};

const editSupplier = async (id) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const suppliers = await response.json();

    const supplier = suppliers.find((s) => s.id === id);

    document.getElementById("name").value = supplier.name;

    document.getElementById("phone").value = supplier.phone;

    document.getElementById("email").value = supplier.email;

    document.getElementById("address").value = supplier.address;

    editingSupplierId = id;

    document.querySelector("#supplierForm button[type='submit']").innerText =
      "Update Supplier";
  } catch (error) {
    console.log(error);
  }
};

// INITIAL LOAD
const initializeSuppliersPage = async () => {
  await fetchSuppliers();
};

// RUN ON PAGE LOAD
initializeSuppliersPage();

// AUTO REFRESH
setInterval(() => {
  fetchSuppliers();
}, 2000);
