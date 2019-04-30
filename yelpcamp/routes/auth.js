var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

router.post("/register", function(req, res) {
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

router.get("/register", function(req, res) {
    res.render("register", {error:""});
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
} );

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;