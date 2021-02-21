const   express         = require("express"),
        router          = express.Router(),
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
router.get("/new",isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/",isLoggedIn, (req, res)=>{
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
            console.log(err);
        }else{
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
router.get("/:id/edit",checkCampgroundOwnership, (req, res)=>{    
    Campground.findById(req.params.id, (err, campground)=>{
        res.render("campgrounds/edit", {campground: campground});
    });
});

//Update - update campgrounds in DB
router.put("/:id",checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
        if (err){
            console.error(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//Destroy - delete campground from DB
router.delete("/:id",checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, campground)=>{
            if (err){
                console.error(err);
                res.redirect("back");
            }else{
                if (campground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });  
    }else{
        res.redirect("back");
    }
}

module.exports = router;