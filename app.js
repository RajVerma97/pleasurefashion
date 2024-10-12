const app = require("express")();
app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );

  //intercepts OPTIONS method
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
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
const dotenv = require("dotenv").config();
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

// seeds();

// mongoose.set('useFindAndModify', false);
// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(flash());

// ==============
//MiddleWares
// ==============
// app.use(cookieParser('abcdefg'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//     session({

//         secret: "Raj loves his friends",
//         resave: true,
//         saveUninitialized: false,
//     })
// );
// mongoose.set('useFindAndModify', false);
// app.use((req, res, next) => {
//   if (!req.session.regenerate) {
//     req.session.regenerate = (cb) => cb();
//   }
//   next();
// });

app.use(
  cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ==============
//Passport Config
// ==============

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

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// passport.use(new localStrategy(User.authenticate()));
// passport.use(User.createStrategy());

// razorpay key ids

var RAZOR_PAY_KEY_ID = "rzp_test_pG5ZsBewvcRAo8";
var RAZOR_PAY_KEY_SECRET = "sFWzimejIdANS7p60CfyobJ9";

//razorpay instance
const instance = new Razorpay({
  key_id: RAZOR_PAY_KEY_ID,
  key_secret: RAZOR_PAY_KEY_SECRET,
});

//local variables middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.use(function (req, res, next) {
//     if (req.session.user == null) {
//         // if user is not logged-in redirect back to login page //
//         res.redirect('/');
//     } else {
//         next();
//     }
// });

//routes which handle requests
app.get("/", (req, res) => {
  res.render("users/signup");
});

// Middleware - Check user is Logged in
const checkUserLoggedIn = (req, res, next) => {
  req.user ? next() : res.redirect("/");
};

app.get("/index", checkUserLoggedIn, (req, res) => {
  res.render("index");
});

app.get("/failed", (req, res) => {
  res.send("<h1>Log in Failed :(</h1>");
});

//Protected Route.
app.get("/profile", checkUserLoggedIn, (req, res) => {
  console.log("hello");

  res.redirect("/index");
});

// Auth Routes

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

//Logout
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
      amount: 2 * 100, // amount == Rs 10
      currency: "INR",
      receipt: "receipt#1",
      payment_capture: 0,
      // 1 for automatic capture // 0 for manual capture
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

// app.post("/capture/:paymentId", (req, res) => {
//     try {
//         return request(
//             {
//                 method: "POST",
//                 url: `https://${RAZOR_PAY_KEY_ID}:${RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
//                 form: {
//                     amount: 2 * 100, // amount == Rs 10 // Same As Order amount
//                     currency: "INR",
//                 },
//             },
//             async function (err, response, body) {
//                 if (err) {
//                     return res.status(500).json({
//                         message: "Something Went Wrong",
//                     });
//                 }
//                 console.log("Status:", response.statusCode);
//                 console.log("Headers:", JSON.stringify(response.headers));
//                 console.log("Response:", body);
//                 return res.status(200).json(body);
//             });
//     } catch (err) {
//         return res.status(500).json({
//             message: "Something Went Wrong",
//         });
//     }
// });
// app.post('/purchase', checkAuth, async (req, res, next) => {

//     // console.log(req.body);

//     // var products = req.body.products;

//     // // var html = '';

//     // // products.forEach(product => {
//     // //     html += product.name;

//     // // });
//     // // console.log('html is' + html);

//     // stripe.charges.create({
//     //     amount: 200,
//     //     source: req.body.tokenId,
//     //     currency: 'INR'

//     // }).then(result => {
//     //     console.log(result);

//     //     var transporter = nodemailer.createTransport({
//     //         service: 'gmail',
//     //         auth: {
//     //             user: 'rajneeshkumar2545@gmail.com',
//     //             pass: 'nloqerbrittoudhi'
//     //         }
//     //     });

//     //     var mailOptions = {
//     //         from: 'rajneeshkumar2545@gmail.com',
//     //         to: 'ssbcap@gmail.com',
//     //         subject: 'Pleasure',
//     //         text: 'Your order was confirmed and it will be delivered in a few days.'

//     //     };

//     //     transporter.sendMail(mailOptions, function (error, info) {
//     //         if (error) {
//     //             console.log(error);
//     //         } else {
//     //             console.log('Email sent: ' + info.response);
//     //         }
//     //     });
//     // })
//     //     .catch(err => {
//     //         console.log(err);
//     //     })

// });

//404 page not found
app.get("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
  });
});

// var dbUrl = process.env.DB_URL || 'mongodb://localhost/women-shop';

//connecting to the mongo db database
mongoose.connect(
  process.env.DB_URL
  // { useUnifiedTopology: true },
  // { useNewUrlParser: true }
);

//to start listening for incoming requests
app.listen(port, () => {
  console.log("Pleasure Site Server has started on port " + port);
});
