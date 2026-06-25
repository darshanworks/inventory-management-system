const db = require("../config/db");

const addSupplier = (req, res) => {
  const { name, phone, email, address } = req.body;

  const sql = `
    INSERT INTO suppliers
    (name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, phone, email, address], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Supplier added successfully",
    });
  });
};

const getSuppliers = (req, res) => {
  const sql = "SELECT * FROM suppliers";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

const updateSupplier = (req, res) => {
  const { id } = req.params;

  const { name, phone, email, address } = req.body;

  const sql = `
    UPDATE suppliers
    SET
      name = ?,
      phone = ?,
      email = ?,
      address = ?
    WHERE id = ?
  `;

  db.query(sql, [name, phone, email, address, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json({
      message: "Supplier updated successfully",
    });
  });
};

const deleteSupplier = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM suppliers WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  });
};

module.exports = {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
