const createDatabaseConnection = require("../db.js");
db = createDatabaseConnection();

const categoryController = {
  getAllCategories: (req, res) => {
    const query = "SELECT * FROM category";
    db.query(query, (err, result) => {
      if (err) {
        console.log("Error fetching category: ", err);
        return res.status(500).json({ err: err.message });
      }
      res.render("category.ejs", { categories: result });
    });
  },

  createNewCategory: (req, res) => {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const query = "INSERT INTO category (CategoryName) VALUES (?)";
    db.query(query, [categoryName], (err, result) => {
      if (err) {
        console.log("Error Createing category: ", err);
        return res.status(500).json({ err: err.message });
      }
      res.redirect("/category");
    });
  },

  updateCategoryPage: (req, res,next) => {
    const { categoryId } = req.params;
    const query = "SELECT * FROM category WHERE CategoryId = ?";
    db.query(query, [categoryId], (err, result) => {
      if (err) {
        console.log("Error fetching category: ", err);
        return next(err); 
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.render("editCategory.ejs", { category: result[0] });
    });
  },

  updateCategory: (req, res) => {
    console.log("Updating category");
    const { categoryName } = req.body;
    const { categoryId } = req.params;

    if (!categoryName) {
      return res.status(400), json({ error: "Category name is required" });
    }
    const query = "UPDATE category SET CategoryName = ? WHERE CategoryId = ?";
    db.query(query, [categoryName, categoryId], (err, result) => {
      if (err) {
        console.log("Error updating the category: ", err);
        return next(err); 
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.redirect("/category");
    });
  },

  deleteCategory: (req, res) => {
    const { categoryId } = req.params;

    const query = "DELETE FROM category WHERE CategoryId = ?";
    db.query(query, [categoryId], (err, result) => {
      if (err) {
        console.log("Error deleting category:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.redirect("/category");
    });
  },
};

module.exports = categoryController;
