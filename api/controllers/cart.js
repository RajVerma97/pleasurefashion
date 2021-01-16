const mongoose = require('mongoose');
const Cart = require('../models/cart');
const Product = require('../models/product');

exports.cart_get_products = async (req, res) => {

    try {
        const foundCart = await Cart.findOne({ owner: req.user }).populate('owner').exec();
        // const foundProducts = foundCart.products
        var totalPrice = 0;
        foundCart.products.forEach(p => {
            totalPrice += p.price*p.quantity;
        });
        const response = await Cart.findOneAndUpdate({ owner: req.user }, { $set: { total: totalPrice } }).exec();
        const cart = await Cart.findOne({ owner: req.user }).populate('owner').exec();
        // console.log('final cart is'+response2);
        res.render('cart/cart', { cart: cart })

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }


}


exports.cart_delete_products_all = async (req, res) => {
    const response = await Cart.findOneAndRemove({ owner: req.user }).exec();
    console.log(response);
}
exports.cart_add_product = async (req, res) => {

    var productId = req.body.productId;
    var productSize = req.body.productSize;
    var productQuantity = req.body.productQuantity;
   


    try {

        const foundCart = await Cart.findOne({ owner: req.user }).exec();

        const result = await Cart.findOne({ owner: req.user, products: req.params.productId }).exec();
        // console.log(result);


        const product = await Product.findOne({ _id: productId }).exec();

        var newProduct = {
            _id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: productQuantity,
            size: productSize
        }


        foundCart.products.push(newProduct);

        foundCart.save().then()
            .catch(err => console.log(err));




    }


    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }



}


exports.cart_delete_product = async (req, res) => {



    Cart.findOne({ owner: req.user }).exec()
        .then(foundCart => {
            console.log('foundCart is' + foundCart);
            var arr = [];
            foundCart.products.forEach(product => {
                if (!(product._id == req.params.productId)) {
                    arr.push(product);
                }
            });
            console.log(arr);
            Cart.findOneAndUpdate({ owner: req.user }, { $set: { products: arr } }).exec()
                .then(response => res.redirect('/cart'))
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));






}








