const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:categoryId", productController.getAllProducts);
router.post("/create", productController.createProduct);
router.get("/update/:productId", productController.updateProductForm);
router.put("/update/:productId", productController.updateProduct);
router.delete("/delete/:productId", productController.deleteProduct);

module.exports = router;
