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
router.get("/new", (req, res)=>{
    res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/", (req, res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    var newCampground = {name : name, image: image, description: description};
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

module.exports = router;