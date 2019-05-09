var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObject = {};

middlewareObject.isLoggedIn = function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first!")
    res.redirect("/login");
}

middlewareObject.isCampgroundOwner = function isCampgroundOwner(req, res, next) {
    Campground.findById(req.params.id, function(error, result) {
        if (result.author.id.equals(req.user.id)) {
            next();
        } else {
            res.redirect("back");
        }
    }); 
}

middlewareObject.isCommentOwner = function isCommentOwner(req, res, next) {
    Comment.findById(req.params.comment_id, function(error, result) {
        if (result.author.id.equals(req.user.id)) {
            next();
        } else {
            res.redirect("back");
        }
    });
}

module.exports = middlewareObject;