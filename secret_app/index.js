var express =  require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require ("./models/user");
    
    
require('dotenv').config();

var app = express();
app.set("view engine", "ejs");

app.use(require("express-session") ({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect("mongodb://localhost/secret_app");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res) {
   res.render("home") 
});

app.get("/register", function(req, res) {
    res.render("register", {errorString:null});
});

app.post("/register", function(req, res) {
    if (req.body.password != req.body.confirmpassword) {
        res.render("register", {errorString:"Password does not match"});
    } else {
        User.register(new User({username: req.body.username}), req.body.password, 
        function (error, user) {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secret");
            });    
        });
    }
});

app.post("/", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/"
}), function(req, res) {
} )

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/secret", isLoggedIn, function(res, res) {
    res.render("secret")
});

app.post("/", function(req, res) {
    
});

app.listen(process.env.PORT, process.env.IP);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}