const mongoose = require('mongoose');
const Product = require('./api/models/product');
const Comment = require('./api/models/comments');
const User = require('./api/models/users');
const Cart = require('./api/models/cart');
const Order = require('./api/models/orders');



const express = require('express');
const products = require('./products.json');

// products.forEach(product => {

//     //random num -1 xs
//     //random num -2 xs,s
//     //random num-3 xs,s,m
//     //random num -4 xs,s,m,l
//     //random num -5 xs,s,m,l,xl
//     var randomNumber = Math.floor(Math.random() * 5) + 1;
//     var sizes = [];
//     console.log(randomNumber);
//     switch (randomNumber) {
//         case 1: sizes = ['xs'];
//             break;
//         case 2: sizes = ['xs', 's'];
//             break;
//         case 3: sizes = ['xs','s','m']
//             break;
//         case 4: sizes = ['xs', 's','m','l'];
//             break;
//         case 5: sizes = ['xs', 's','m','l','xl'];
//             break;

//     }

//     product.sizes =sizes;

// });

// console.log(JSON.stringify(products));



module.exports = async () => {
    //first remove all the campgrounds

    try {

        const response1 = await Product.remove({}).exec();
        const response2 = await User.remove({}).exec();
        const response3 = await Order.remove({}).exec();
        const response4 = await Wishlist.remove({}).exec();
        const response5 = await Cart.remove({}).exec();
        const response6 = await Comment.remove({}).exec();
        

        console.log("Removed all entries");

        products.forEach(product => {
            const newProduct = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: product.name,
                image: product.image,
                price: product.price,
                description: product.description,
                tags: product.tags,
                sizes: product.sizes,
                wishlist:[]

            });
            newProduct.save()
                .then(savedProduct => {
                    
                })
                .catch(err => console.log(err));




        })

    }
    catch (err) {
        console.log(err);
    }




}