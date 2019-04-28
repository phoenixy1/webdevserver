var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
var request = require("request");
app.set("view engine", "ejs");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var SeedDB = require("./seed.js");
SeedDB();

app.set("view engine", "ejs");

require('dotenv').config();

app.use(require("express-session") ({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(error, result) {
        res.render("comments/form", {campground:result});
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        Comment.create(req.body, function(error, comment ) {
            campground.comments.push(comment);
            campground.save();
        });
    });
    res.redirect("/campgrounds/"+req.params.id);
});


app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/form");
});

app.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(error, result) {
        res.render("campgrounds/show", {campground:result});
    });
});


app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(error, results) {
            res.render("campgrounds/campgrounds", {campgrounds:results});
    });
});



app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    Campground.create({name:name, img_url:url, description:description});
    res.redirect("/campgrounds");
    });

app.post("/register", function(req, res) {
    console.log(req);
    User.register(new User({username: req.body.username}), req.body.password, 
    function (error, user) {
        if (error) {
            res.render("register", {error: error});
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

app.get("/register", function(req, res) {
    res.render("register", {error:""});
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
} );

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP);