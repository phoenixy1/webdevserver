var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({ extended: true }));

var campgroundSchema = new mongoose.Schema({
    name: String,
    img_url: String,
    description: String
});

var campground = mongoose.model("Campground", campgroundSchema);

app.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;
    campground.findById(id, function(error, result) {
        res.render("show", {campground:result})
    });
});


app.get("/campgrounds", function(req, res) {
    campground.find({}, function(error, results) {
            res.render("campgrounds", {campgrounds:results})
    });
});



app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    campground.create({name:name, img_url:url, description:description});
    res.redirect("/campgrounds");
    });

app.get("/campgrounds/new", function(req, res) {
    res.render("form");
});


app.listen(process.env.PORT, process.env.IP);