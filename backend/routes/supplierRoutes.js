const express = require("express");
const router = express.Router();

const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addSupplier);

router.get("/", verifyToken, getSuppliers);

router.put("/:id", verifyToken, updateSupplier);

router.delete("/:id", verifyToken, deleteSupplier);

module.exports = router;
