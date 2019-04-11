var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var postSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var post = mongoose.model("Post", postSchema);


app.get("/posts", function(req, res) {
    post.find({}, function (error, posts) {
        res.render("index", {posts:posts});
    });
});

app.get("/posts/new", function(req, res) {
    res.render("new");
    });
    
app.post("/posts", function(req, res) {
    post.create(req.body.post);
        res.redirect("/posts");
});

app.get("/posts/:id", function(req, res) {
    post.findById(req.params.id, function(error, post) {
        res.render("show", {post:post});
    });
});

app.get("/posts/:id/edit", function(req, res) {
    post.findById(req.params.id, function(error, post) {
        res.render("edit", {post:post});
    });
});

app.put("/posts/:id", function(req, res) {
    post.findByIdAndUpdate(req.params.id, req.body.post, {new: true}, function(error, post) {
            res.redirect("/posts/"+req.params.id);

    });
});

app.delete("/posts/:id", function(req, res) {
    post.findByIdAndRemove(req.params.id, function(error, post) {
        res.redirect("/posts/");
    });
});

app.listen(process.env.PORT, process.env.IP);
