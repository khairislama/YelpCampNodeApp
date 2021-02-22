const   express         = require("express"),
        router          = express.Router(),
        middleware      = require("../middleware"),
        Campground      = require("../models/compground");

//INDEX - show all campgrounds 
router.get("/", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//NEW - show form to create new campgrounds
router.get("/new",middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn, (req, res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name : name, image: image, description: description, author: author};
    Campground.create(newCampground, (err, newCampground)=>{
        if(err){
            req.flash("error", "Oops! There is a Database problem!");
            res.redirect("back");
        }else{
            req.flash("success", "Campground added successfully");
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - shows more info about one campground
router.get("/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit - show the edit form
router.get("/:id/edit",middleware.checkCampgroundOwnership, (req, res)=>{    
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            res.render("campgrounds/edit", {campground: campground});
        }        
    });
});

//Update - update campgrounds in DB
router.put("/:id",middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
        if (err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            req.flash("success", "Campground updated successfully");
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//Destroy - delete campground from DB
router.delete("/:id",middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            req.flash("success", "Campground Deleted successfully");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;