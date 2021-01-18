const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose=require('mongoose');


router.get('/:tagName', (req, res, next) => {
    const tagName = req.params.tagName;

    Product.find({ tags: tagName }).then(result => {

        res.render('products/products', { products: result });


    })
        .catch(err => console.log(err));


});


module.exports = router;