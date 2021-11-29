//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("user", userSchema);




const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

// Post Method

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.render("login");
            }
        });
    });


});


app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, resultLogin) {
        if (err) {
            console.log(err);
        } else {
            if (resultLogin) {
                bcrypt.compare(password, resultLogin.password, function(err, result) {
                    if (result == true) {
                        res.render("secrets");
                    } else {
                        res.render("login");
                    }
                });

            } else {
                console.log("we couldn't find the user,sorry");
            }
        }
    });
})
app.listen(3000, function(request, response) {
    console.log("Server has started successfully at the port 3000");
});