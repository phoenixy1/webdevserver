var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var campgroundDataArray = [
    {
        name: "Castle Rock",
        img_url: "https://media-cdn.tripadvisor.com/media/photo-s/03/4b/2d/4c/castle-rock-state-park.jpg",
        description: "You are camping there next month!"
    }, 
    {
        name: "Mt. Tam",
        img_url: "https://cdn.funcheap.com/wp-content/uploads/2015/10/Mount_tamalpais_from_berkeley.jpg",
        description: "Good luck getting a campsite here!  Sucker"
    },
    {
        name: "Mt. Diablo",
        img_url: "https://static.rootsrated.com/image/upload/s--6bXDFtWJ--/t_rr_large_natural/rxryksqp4mvaou85wppt.jpg",
        description: "You are camping there soon!"
    }
]

var commentData = {
    author: "Alex",
    text: "This place is nice but I wish it had Internet"
}

function SeedDB() {
    Campground.remove({}, function() {
        campgroundDataArray.forEach(function(campgroundData) {
            Campground.create(campgroundData, function(err, campground) {
                Comment.create(commentData, function(err, comment) {
                        campground.comments.push(comment);
                        campground.save();
                });
            }); 
        });
    });
}

module.exports = SeedDB;