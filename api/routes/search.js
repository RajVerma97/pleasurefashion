const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.post("/", async (req, res, next) => {
  const query = req.body.query.toLowerCase().trim();
  const Products = await Product.find().exec();

  var i = 0;

  var products = Products.filter(product => {
    if (
      product.name.toLowerCase().indexOf(query) > -1 ||
      product.tags.indexOf(query) > -1
    ) {
      return product;
    }
  });

  res.render("products/products", { products: products });
});

module.exports = router;
