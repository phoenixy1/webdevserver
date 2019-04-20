var mongoose = require("mongoose");
var passporLocalMongoose = require("passport-local-mongoose");

var UserSchema= new mongoose.Schema( {
    name: String,
    password: String
}); 

UserSchema.plugin(passporLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
