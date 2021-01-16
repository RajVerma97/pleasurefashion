const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      size: String
    }
  ],

  total: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Cart", cartSchema);
