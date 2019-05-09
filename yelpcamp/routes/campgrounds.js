var express = require("express");
var router = express.Router();
var middleware = require("../middleware")

var flash = require("connect-flash");
router.use(flash());

var Campground = require("../models/campground");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/form");
});

router.get("/:id", function(req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(error, result) {
        res.render("campgrounds/show", {campground:result});
    });
});

router.get("/", function(req, res) {
    Campground.find({}, function(error, results) {
            res.render("campgrounds/campgrounds", {campgrounds:results});
    });
});


router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var author = { id: req.user.id, username: req.user.username};
    Campground.create({name:name, img_url:url, description:description, author:author});
    res.redirect("/campgrounds");
    });

router.get("/:id/edit", middleware.isCampgroundOwner, function(req, res) {
    var id = req.params.id;
    Campground.findById(id, function(error, campground) {
        res.render("campgrounds/edit", {campground: campground})
    });
});

router.put("/:id", middleware.isCampgroundOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function() {
        res.redirect("/campgrounds/" + req.params.id);
    });
}); 

router.delete("/:id", middleware.isCampgroundOwner, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function() {
        res.redirect("/campgrounds/");
    });
});

module.exports = router;