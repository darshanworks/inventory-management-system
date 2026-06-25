const db = require("../config/db");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const addTransaction = (req, res) => {
  const { product_id, type, quantity } = req.body;

  // Get current product quantity
  const getProductSql = "SELECT quantity FROM products WHERE id = ?";

  db.query(getProductSql, [product_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let currentQuantity = result[0].quantity;

    let newQuantity;

    if (type === "IN") {
      newQuantity = Number(currentQuantity) + Number(quantity);
    } else {
      newQuantity = Number(currentQuantity) - Number(quantity);

      if (newQuantity < 0) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }
    }

    // Update product quantity
    const updateSql = "UPDATE products SET quantity = ? WHERE id = ?";

    db.query(updateSql, [newQuantity, product_id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      // Insert transaction
      const transactionSql = `
          INSERT INTO transactions
          (product_id, type, quantity)
          VALUES (?, ?, ?)
        `;

      db.query(transactionSql, [product_id, type, quantity], (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(201).json({
          message: "Transaction completed successfully",
        });
      });
    });
  });
};

const getTransactions = (req, res) => {
  const sql = `
    SELECT
      transactions.*,
      products.name AS product_name
    FROM transactions
    LEFT JOIN products
    ON transactions.product_id = products.id
    ORDER BY transactions.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

const exportTransactions = (req, res) => {
  const sql = `
    SELECT
      transactions.id,
      products.name AS product_name,
      transactions.type,
      transactions.quantity,
      transactions.created_at
    FROM transactions
    JOIN products
      ON transactions.product_id = products.id
    ORDER BY transactions.created_at DESC
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      {
        header: "Product",
        key: "product_name",
        width: 25,
      },
      {
        header: "Type",
        key: "type",
        width: 15,
      },
      {
        header: "Quantity",
        key: "quantity",
        width: 15,
      },
      {
        header: "Date",
        key: "created_at",
        width: 25,
      },
    ];

    results.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  });
};

const exportTransactionsPDF = (req, res) => {
  const sql = `
    SELECT
      products.name AS product_name,
      transactions.type,
      transactions.quantity,
      transactions.created_at
    FROM transactions
    JOIN products
      ON transactions.product_id = products.id
    ORDER BY transactions.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=transactions.pdf",
    );

    doc.pipe(res);

    doc.fontSize(20);
    doc.text("Inventory Transactions Report");

    doc.moveDown();

    results.forEach((transaction) => {
      doc.fontSize(12);

      doc.text(`Product: ${transaction.product_name}`);

      doc.text(`Type: ${transaction.type}`);

      doc.text(`Quantity: ${transaction.quantity}`);

      doc.text(`Date: ${new Date(transaction.created_at).toLocaleString()}`);

      doc.moveDown();
    });

    doc.end();
  });
};

module.exports = {
  addTransaction,
  getTransactions,
  exportTransactions,
  exportTransactionsPDF,
};
