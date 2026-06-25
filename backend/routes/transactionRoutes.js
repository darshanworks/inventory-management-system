const express = require("express");
const router = express.Router();

const {
  addTransaction,
  getTransactions,
  exportTransactions,
  exportTransactionsPDF,
} = require("../controllers/transactionController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addTransaction);

router.get("/", verifyToken, getTransactions);

router.get("/export", verifyToken, exportTransactions);

router.get("/export-pdf", verifyToken, exportTransactionsPDF);

module.exports = router;
