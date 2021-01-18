const Product = require('../models/product');
const Comment = require('../models/comments');
const User = require('../models/users');
const mongoose=require('mongoose');


exports.products_get_all = async (req, res, next) => {

    try {
        const products = await Product.find().exec();
        res.status(200).json({
            products: products
        });

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }


}
exports.product_get_product = async (req, res, next) => {
    const productId = req.params.productId;

    try {

        const product = await Product.findById(productId).populate('comments').exec();
        res.render('products/details', { product: product });

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }

}



exports.product_delete_product = async (req, res, next) => {
    const productId = req.params.productId;

    try {

        const result = await Product.remove({ _id: productId }).exec();
        res.status(200).json(result);

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }

}
exports.product_update_product = async (req, res, next) => {
    const productId = req.params.productId;
    const updatedProduct = req.body;

    try {
        const result = await Product.update({ _id: productId }, { $set: updatedProduct }).exec();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }



}


exports.product_create_comment = async (req, res, next) => {

    const productId = req.params.productId;

    try {
        const foundProduct = await Product.findOne({ _id: productId }).exec();

        const newComment = new Comment({
            _id: new mongoose.Types.ObjectId(),
            text: req.body.comment,
            like: 10,
            author: {
                username: req.user.username,
                profileImage:req.user.profileImage,
            }

        });


        const createdComment = await newComment.save();
        foundProduct.comments.push(createdComment);

        const savedProduct = foundProduct.save();
        res.redirect(`/products/${productId}`);

    }
    catch (err) {
        res.status(500).json({
            error: err
        });
        next(err);
    }


}

