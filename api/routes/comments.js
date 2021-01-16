const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const mongoose = require('mongoose');
const Product = require('../models/product');


router.get('/:commentId/:action', (req, res) => {

    var action = req.params.action;
    var counter = action === 'like' ? 1 : -1;


    Comment.findOne({
        _id: req.params.commentId
    })
        .then(result => {
    
            Comment.update({ _id: req.params.commentId }, { $inc: { likes: counter } })
                .exec().then(result => res.send(''))
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));

});



module.exports = router;