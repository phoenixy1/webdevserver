var express = require("express");
var app = express();
app.use(express.static('public'))


var flash = require("connect-flash");
app.use(flash());

var bodyParser = require("body-parser");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

var authRoutes = require("./routes/auth");
var commentsRoutes  = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");


var SeedDB = require("./seed.js");
//SeedDB();

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments/", commentsRoutes);

app.listen(process.env.PORT, process.env.IP);