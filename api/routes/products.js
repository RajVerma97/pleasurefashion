const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const products = require('../../products.json');
const productController = require('../controllers/products');
const orderController = require('../controllers/orders');
const User = require('../models/users');

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

router.get('/', productController.products_get_all);

router.post('/:productId/comments', productController.product_create_comment);

router.get("/:productId", productController.product_get_product);

router.delete("/:productId", productController.product_delete_product);

router.patch("/:productId", productController.product_update_product);




module.exports = router;
