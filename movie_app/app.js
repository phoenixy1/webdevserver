var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");

app.get("/results", function(req, res) {
    var query = req.query.query;
            request("http://www.omdbapi.com/?s=" + query + "&apikey=83e3278c", function(error, response) {
                var results = JSON.parse(response.body).Search;
                res.render("results", {results: results});
            });
        });
        
app.get("/", function(req, res) {
    res.render("search");
});
app.listen(process.env.PORT, process.env.IP);
