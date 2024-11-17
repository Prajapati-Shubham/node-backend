const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/categoryController.js");

router.get("/", categoryController.getAllCategories);
router.post("/create", (categoryController.createNewCategory));
router.get("/update/:categoryId", (categoryController.updateCategoryPage));
router.put("/update/:categoryId", (categoryController.updateCategory));
router.delete("/delete/:categoryId", categoryController.deleteCategory);

module.exports =router;