//jshint esversion:6
// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require("path");
const pathview = path.join(__dirname, "/views")



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("views", pathview);
app.set("view engine", "ejs");
app.use(session({
    secret: "This is a secret.",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");
// mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// get method

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});
app.get("/sec", function(req, res) {
    if (req.isAuthenticated) {
        res.render("/sec");
    } else {
        res.redirect("/login");
    }
});
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// Post Method

app.post("/register", function(req, res) {
    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/login");
            });
        }
    });
});


app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if (err) {
            console.log(err);
            res.render("/login");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.render("/sec");
            });
        }
    });

});
app.listen(3000, function(request, response) {
    console.log("Server has started successfully at the port 3000");
});