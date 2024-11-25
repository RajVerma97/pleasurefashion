const app = require("express")();
app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
});
const port = process.env.PORT || 3000;
const express = require("express");
const orderRoutes = require("./api/routes/orders");
const productRoutes = require("./api/routes/products");
const searchRoutes = require("./api/routes/search");
const tagRoutes = require("./api/routes/tags");
const commentRoutes = require("./api/routes/comments");
const cartRoutes = require("./api/routes/cart");
const wishlistRoutes = require("./api/routes/wishlist");
const paperWorkRoutes = require("./api/routes/paperwork");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const seedDb = require("./seeds");
const morgan = require("morgan");
const axios = require("axios");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const Cart = require("./api/models/cart");
const Razorpay = require("razorpay");
const cors = require("cors");

const User = require("./api/models/users");
const passport = require("passport");
const localStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const checkCart = require("./api/middlewares/check-cart");
var seeds = require("./seeds");
var flash = require("connect-flash");
const cookieSession = require("cookie-session");

dotenv.config({ path: process.env.ENV_FILE });

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(flash());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      var profileJson = profile._json;

      const existingUser = await User.findOne({ googleID: profile.id });
      if (existingUser) {
        cb(null, existingUser);
      } else {
        var newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          googleID: profile.id,
          username: profileJson.name,
          email: profileJson.email,
          profileImage: profileJson.picture,
        });
        const savedUser = await newUser.save();
        cb(null, savedUser);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

var RAZOR_PAY_KEY_ID = "rzp_test_pG5ZsBewvcRAo8";
var RAZOR_PAY_KEY_SECRET = "sFWzimejIdANS7p60CfyobJ9";

const instance = new Razorpay({
  key_id: RAZOR_PAY_KEY_ID,
  key_secret: RAZOR_PAY_KEY_SECRET,
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

const checkUserLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "User is not logged in",
    });
  }
  next();
};

app.get("/failed", (req, res) => {
  res.send("<h1>Log in Failed :(</h1>");
});

app.get("/profile", checkUserLoggedIn, (req, res) => {
  res.redirect("/");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    res.redirect("/profile");
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

app.use("/products", productRoutes);
app.use("/cart", checkUserLoggedIn, checkCart, cartRoutes);
app.use("/orders", checkUserLoggedIn, orderRoutes);
app.use("/wishlist", checkUserLoggedIn, wishlistRoutes);
app.use("/search", searchRoutes);
app.use("/tags", tagRoutes);
app.use("/comments", checkUserLoggedIn, commentRoutes);
app.use("/paperwork", paperWorkRoutes);

app.get("/order", (req, res) => {
  try {
    const options = {
      amount: 2 * 100,
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

console.log("DB_URL:", process.env.DB_URL);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("CALLBACK_URL:", process.env.CALLBACK_URL);
mongoose.connect(process.env.DB_URL);

app.listen(port, () => {
  console.log("Pleasure Site Server has started on port " + port);
});
