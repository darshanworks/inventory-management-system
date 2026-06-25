const db = require("../config/db");

const addProduct = (req, res) => {
  const { name, category, price, quantity, supplier_id } = req.body;

  // DEBUGGING
  console.log(req.body);

  const sql = `
    INSERT INTO products
    (name, category, price, quantity, supplier_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, category, price, quantity, supplier_id],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Product added successfully",
      });
    },
  );
};

const getProducts = (req, res) => {
  const sql = `
    SELECT 
      products.*,
      suppliers.name AS supplier_name
    FROM products
    LEFT JOIN suppliers
    ON products.supplier_id = suppliers.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;

  const { name, category, price, quantity, supplier_id } = req.body;

  const sql = `
    UPDATE products
    SET
      name = ?,
      category = ?,
      price = ?,
      quantity = ?,
      supplier_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, category, price, quantity, supplier_id, id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Product updated successfully",
      });
    },
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  // Delete related transactions first
  const deleteTransactionsSql = "DELETE FROM transactions WHERE product_id = ?";

  db.query(deleteTransactionsSql, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    // Then delete product
    const deleteProductSql = "DELETE FROM products WHERE id = ?";

    db.query(deleteProductSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message: "Product deleted successfully",
      });
    });
  });
};

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
