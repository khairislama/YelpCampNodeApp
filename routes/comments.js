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
                    //add user to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//EDIT - show the edit form
router.get("/:comment_id/edit", (req, res)=>{
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err){
            console.error(err);
            res.redirect("back");
        }else{
            res.render("comments/edit", {comment: comment, campground_id: res.params.id});
        }
    });    
});

//UPDATE - the logic to update the comment from the DB
router.put("/:comment_id", (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//DESTROY - delete our comment
router.delete("/:comment_id", (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            console.error(err);
            res.redirect("back");
        }else{
            res.redirect(`/campgrounds/${req.params.id}`);
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