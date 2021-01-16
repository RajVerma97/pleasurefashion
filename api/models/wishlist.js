const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
