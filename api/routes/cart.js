const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const CartController = require('../controllers/cart');

router.get('/', CartController.cart_get_products);
router.post('/', CartController.cart_add_product);
router.delete('/:productId', CartController.cart_delete_product);

module.exports = router;