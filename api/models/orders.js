const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "xs" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Order", orderSchema);
