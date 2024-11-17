const createDatabaseConnection = require("../db.js");
db = createDatabaseConnection();

const productController = {
  getAllProducts: (req, res) => {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    // Fetch products for the given category and pagination
    db.query(
      "SELECT * FROM product WHERE CategoryId=? LIMIT ? OFFSET ?",
      [categoryId, itemsPerPage, offset],
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Get the total count of products for pagination
        db.query(
          "SELECT COUNT(*) AS total FROM product WHERE CategoryId=?",
          [categoryId],
          (err, countResult) => {
            if (err) {
              return res.status(500).send("Server Error");
            }

            const totalItems = countResult[0].total;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // Fetch all categories to populate the dropdown list
            db.query("SELECT * FROM Category", (err, categories) => {
              if (err) {
                return res.status(500).send("Server Error");
              }

              // Fetch the current category based on categoryId
              db.query(
                "SELECT * FROM Category WHERE CategoryId=?",
                [categoryId],
                (err, categoryResult) => {
                  if (err) {
                    return res.status(500).send("Server Error");
                  }

                  const currentCategory = categoryResult[0];

                  // Render the products page with necessary data
                  res.render("products.ejs", {
                    products: results,
                    currentCategory: currentCategory,
                    categories: categories,
                    categoryId: categoryId,
                    page: page,
                    totalPages: totalPages,
                  });
                }
              );
            });
          }
        );
      }
    );
  },

  createProduct: (req, res) => {
    const { productName, categoryId } = req.body;
    // console.log(productName, categoryId);
    // Check if categoryId is missing or invalid
    if (!categoryId) {
      return res.status(400).send("Category is required.");
    }
    // Ensure productName is also present
    if (!productName) {
      return res.status(400).send("Product name is required.");
    }

    db.query(
      "INSERT INTO Product (productName, CategoryId) VALUES (?,?)",
      [productName, categoryId],
      (err) => {
        if (err) throw err;
        res.redirect(`/product/${categoryId}`);
      }
    );
  },

  updateProductForm: (req, res) => {
    const productId = req.params.productId;

    db.query(
      "SELECT * FROM product WHERE ProductID=?",
      [productId],
      (err, result) => {
        if (err) {
          return res.status(500).send("Server Error");
        }
        const product = result[0];

        db.query("SELECT * FROM category", (err, categories) => {
          if (err) {
            return res.status(500).send("Server Error");
          }
          res.render("editProduct.ejs", {
            product,
            categories,
          });
        });
      }
    );
  },

  updateProduct: (req, res) => {
    const { productName, categoryId } = req.body;
    const { productId } = req.params.productId;

    if (!categoryId) {
      return res.status(400).send("Category is required");
    }
    db.query(
      "UPDATE Product SET ProductName =? ,CategoryId=? WHERE ProductId=?",
      [productName, categoryId, productId],
      (err) => {
        if (err) throw err;
        res.redirect(`/product/${categoryId}`);
      }
    );
  },

  deleteProduct: (req, res) => {
    const { productId } = req.params;
    const { categoryId } = req.body;
    // console.log(categoryId, productId);
    db.query("DELETE FROM Product WHERE ProductId=?", [productId], (err) => {
      if (err) throw err;
      res.redirect(`/product/${categoryId}`);
    });
  },
};

module.exports = productController;
