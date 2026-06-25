const navbar = `
<nav class="bg-black text-white p-4 mb-8">

  <div class="flex justify-between items-center">

    <h1 class="text-xl md:text-2xl font-bold">
      Inventory System
    </h1>

    <!-- Hamburger Button -->
    <button
      id="menuBtn"
      class="md:hidden text-3xl"
    >
      ☰
    </button>

    <!-- Desktop Menu -->
    <div
      class="hidden md:flex gap-6 items-center"
    >

      <a href="dashboard.html">
        Dashboard
      </a>

      <a href="products.html">
        Products
      </a>

      <a href="suppliers.html">
        Suppliers
      </a>

      <a href="transactions.html">
        Transactions
      </a>
      <button
        onclick="logout()"
        class="bg-red-500 px-4 py-1 rounded"
      >
        Logout
      </button>

    </div>

  </div>

  <!-- Mobile Menu -->
  <div
    id="mobileMenu"
    class="hidden flex-col gap-4 mt-4 md:hidden"
  >

    <a href="dashboard.html">
      Dashboard
    </a>

    <a href="products.html">
      Products
    </a>

    <a href="suppliers.html">
      Suppliers
    </a>

    <a href="transactions.html">
      Transactions
    </a>
    
    <button
      onclick="logout()"
      class="bg-red-500 px-4 py-2 rounded"
    >
      Logout 
    </button>

  </div>

</nav>
`;

document.getElementById("navbar").innerHTML = navbar;

const menuBtn = document.getElementById("menuBtn");

const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");

  mobileMenu.classList.toggle("flex");
});

// LOGOUT
const logout = () => {
  localStorage.removeItem("token");

  window.location.href = "index.html";
};
