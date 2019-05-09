var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, 
    function (error, user) {
        if (error) {
            req.flash("error", error.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome, " + user.username)
            res.redirect("/campgrounds");
        });
    });
});

router.get("/register", function(req, res) {
    res.render("register");
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

router.get("/", function(req, res) {
    res.render("landing");
});


module.exports = router;