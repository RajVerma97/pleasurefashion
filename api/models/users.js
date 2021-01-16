var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  googleID: String,
  email: String,
  username: String,
  profileImage: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
