const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/product');

exports.orders_get_all = async (req, res, next) => {

    try {
        const orders = await Order.find({ owner: req.user }).populate('product').exec();
        res.render('orders/orders', { orders: orders});
        
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }



}
exports.orders_create_order = async (req, res, next) => {

    const newOrder = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity:req.body.productQuantity,
        size: req.body.productSize,
        product: req.body.productId,
        owner: req.user
    });
    


    try {
        const savedOrder = await newOrder.save();
        res.redirect('/orders');

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }

}
exports.orders_delete_order = async (req, res, next) => {


    const orderId = req.params.orderId;

    try {

        const removedOrder = Order.remove({ _id: orderId }).exec();
        res.redirect('/orders');
        
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }


}
