const db = require("../config/db");

const getDashboardStats = (req, res) => {
  const dashboardData = {};

  // Total Products
  db.query(
    "SELECT COUNT(*) AS totalProducts FROM products",
    (err, productResult) => {
      if (err) {
        return res.status(500).json(err);
      }

      dashboardData.totalProducts = productResult[0].totalProducts;

      // Total Suppliers
      db.query(
        "SELECT COUNT(*) AS totalSuppliers FROM suppliers",
        (err, supplierResult) => {
          if (err) {
            return res.status(500).json(err);
          }

          dashboardData.totalSuppliers = supplierResult[0].totalSuppliers;

          // Total Transactions
          db.query(
            "SELECT COUNT(*) AS totalTransactions FROM transactions",
            (err, transactionResult) => {
              if (err) {
                return res.status(500).json(err);
              }

              dashboardData.totalTransactions =
                transactionResult[0].totalTransactions;

              // Low Stock Products
              db.query(
                "SELECT * FROM products WHERE quantity < 5",
                (err, lowStockResult) => {
                  if (err) {
                    return res.status(500).json(err);
                  }

                  dashboardData.lowStockProducts = lowStockResult;

                  // Inventory Value
                  db.query(
                    "SELECT price, quantity FROM products",
                    (err, productsResult) => {
                      if (err) {
                        return res.status(500).json(err);
                      }

                      let inventoryValue = 0;

                      productsResult.forEach((product) => {
                        inventoryValue +=
                          Number(product.price) * Number(product.quantity);
                      });

                      dashboardData.inventoryValue = inventoryValue;

                      res.status(200).json(dashboardData);
                    },
                  );
                },
              );
            },
          );
        },
      );
    },
  );
};

module.exports = {
  getDashboardStats,
};
