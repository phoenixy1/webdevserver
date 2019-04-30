var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");

router.get("/new", function(req, res) {
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


router.post("/", function(req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    Campground.create({name:name, img_url:url, description:description});
    res.redirect("/campgrounds");
    });

module.exports = router;