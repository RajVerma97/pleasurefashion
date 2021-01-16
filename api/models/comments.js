var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  text: String,
  likes: { type: Number, default: 0 },
  author: { username: String, profileImage: String }
});

module.exports = mongoose.model("Comment", commentSchema);
