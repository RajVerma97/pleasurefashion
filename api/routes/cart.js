const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const CartController = require('../controllers/cart');

router.get('/data', async (req, res) => {

    try {
        const foundCart = await Cart.findOne({ owner: req.user }).populate('owner').exec();
     
        res.json({
          cart:foundCart
        });

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }
});
router.get('/', CartController.cart_get_products);
router.post('/', CartController.cart_add_product);
router.delete('/:productId', CartController.cart_delete_product);
// router.delete('/', CartController.cart_delete_products_all);

module.exports = router;