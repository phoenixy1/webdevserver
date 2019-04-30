var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, result) {
        res.render("comments/form", {campground:result});
    });
});

router.post("/", function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        Comment.create(req.body, function(error, comment ) {
            campground.comments.push(comment);
            campground.save();
        });
    });
    res.redirect("/campgrounds/"+req.params.id);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;