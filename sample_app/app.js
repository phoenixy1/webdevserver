var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hi there, welcome to my assignment!!");
});

app.get("/speak/:animal", function(req, res) {
    var animal = req.params.animal;
    var noise;
    switch(animal) {
        case "dog":
            noise = "woof";
            break;
        case "cow":
            noise = "moo";
            break;
        case "pig":
            noise = "oink";
            break;
        default:
        break;
    }
    res.send("The " + animal + " says " + noise);
});

app.get("/repeat/:string/:count", function(req, res) {
    var string = req.params.string;
    var count = parseInt(req.params.count, 10);
    var response = "";
    for (var i = 0; i < count; i++) {
        response += string + " ";
        
    }
    res.send(response);
})

app.get("*", function(req, res) {
    res.send("What are you doing with your life?");
});
app.listen(process.env.PORT, process.env.IP);