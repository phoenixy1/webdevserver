var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware")

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, result) {
        res.render("comments/form", {campground:result});
    });
});

router.post("/", function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        Comment.create(req.body, function(error, comment ) {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
        });
    });
    res.redirect("/campgrounds/"+req.params.id);
});

router.delete("/:comment_id", middleware.isCommentOwner, function(req, res) {
    console.log("is comment owner returned")
    Comment.findByIdAndDelete(req.params.comment_id, function() {
    });
    res.redirect("/campgrounds/" + req.params.id);
});

module.exports = router;