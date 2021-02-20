const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Campground      = require("../models/compground"),
        Comment         = require("../models/comment");

//show the new comment form
router.get("/new", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            console.error(err);
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//handling the creation of the new comment
router.post("/", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.error(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if (err){
                    console.error(err);
                    res.redirect("/campgrounds");
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;