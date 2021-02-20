const   mongoose    = require("mongoose"),
        Campground  = require("./models/compground"),
        Comment     = require("./models/comment"),
        User        = require("./models/user");

const data = [
    {
        name: "Ohana Hills",
        image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "Ohana Hills is the best campground in Ohana. there is no bathrooms and 100% natural espace. So please come and visit us in ohana and don't forget to leave us a comment down bellow to tell us what is you're best campground that you've been to"
    },
    {
        name: "Florida's Magical Lac",
        image: "https://q9m3bv0lkc15twiiq99aa1cy-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/TENT.jpeg",
        description: "This is the most visited campground in florida. People come all over the world to camp in here. It's beautiful view and the magical lac will stay in your memorie for ever. So tell us when you'll come visit us and we'll make you a reservation."
    },
    {
        name: "Car ground's forest",
        image: "https://cincinnatiusa.com/sites/default/files/styles/article_full/public/attractionphotos/Winton%20Woods%20Campground.JPG?itok=Iytm6OhO",
        description: "If you're searching for a campground where you need to camp with you're car, you're on your way back home but it's getting late? Please came and visit our wonderfull campground in miami where you can found all the needing elements and assists to pass your night away from home. Bathrooms included."
    },
    {
        name: "Kara main's lac",
        image: "https://media.kare11.com/assets/KARE/images/437173820/437173820_750x422.png",
        description: "Kara main's lac will welcome you to camp you and your familly. It's a familly campground where you can take your kids with you and you can be sure for 100% there well not be and kind of danger. This place is well secured and you'll find all the needs to have the greatest night away from home."
    }
];
function seedDB(){
    // remove all campgrounds
    Campground.remove({}, (err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Campgrounds removed");
            // add campgrounds
            data.forEach((seed)=>{
                Campground.create(seed, (err, campground)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added campground");
                        // add comments
                        Comment.create({
                            text: "This place is greate, but I wish there was internet"
                        }, (err, comment)=>{
                            if(err){
                                console.log(err);
                            }else{
                                User.findOne({username: "khairislama"}, (err, user)=>{
                                    if(err){
                                        console.error(err);
                                    }else{
                                        comment.author.id = user._id;
                                        comment.author.username = user.username;
                                        comment.save();
                                        campground.author.id = user._id;
                                        campground.author.username = user.username;  
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("comment added successfully");                                      
                                    }
                                });                            
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;