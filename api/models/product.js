const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  units: { type: Number, default: 10 },
  description: { type: String, required: true },
  sizes: [],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  tags: [],
  wishlist: []
});

module.exports = mongoose.model("Product", productSchema);
