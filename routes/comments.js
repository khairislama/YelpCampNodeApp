const   express         = require("express"),
        router          = express.Router({mergeParams: true}),
        Campground      = require("../models/compground"),
        middleware      = require("../middleware/index"),
        Comment         = require("../models/comment");

//show the new comment form
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

//handling the creation of the new comment
router.post("/", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if (err){
                    req.flash("error", "Oops! There is a Database problem!");
                    res.redirect("back");
                }else{
                    //add user to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//EDIT - show the edit form
router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });    
});

//UPDATE - the logic to update the comment from the DB
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment)=>{
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            req.flash("success", "Comment updated successfully");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//DESTROY - delete our comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted successfully");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;