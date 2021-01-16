const Cart = require("../models/cart");
module.exports = async (req, res, next) => {
  try {
    const foundCart = await Cart.findOne({ owner: req.user }).exec();
    if (!foundCart) {
      const newCart = new Cart({
        _id: new mongoose.Types.ObjectId(),
        product: [],
        total: 0,
        owner: req.user
      });
      const createdCart = await newCart.save();
      next();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });

    next(err);
  }
};
