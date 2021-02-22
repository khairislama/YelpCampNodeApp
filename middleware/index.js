const   Campground          = require("../models/compground"),
        Comment             = require("../models/comment");
var middlewareObj = {};

//middleware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, comment)=>{
            if (err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                if (comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don\'t have permission to do that");
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            }
        });  
    }else{
        req.flash("error", "You need to be logged in to comment on a post!");
        res.redirect("/login");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, campground)=>{
            if (err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                if (campground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "you don\'t have permission to do that");
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            }
        });  
    }else{
        req.flash("error", "you need to be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;