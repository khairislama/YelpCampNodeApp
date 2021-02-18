const seedDB = require("./seeds");

const   bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        express             = require("express"),
        methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        dotenv              = require("dotenv"),
        app                 = express(),
        Campground          = require("./models/compground"),
        Comment             = require("./models/comment"),
        seedDb              = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
dotenv.config();

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res)=>{
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

app.get("/campgrounds/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// ===============================

app.get("/campgrounds/:id/comments/new", (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            console.error(err);
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res)=>{
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

app.listen(process.env.APP_PORT, () =>{
    console.log(`Serving is starting on port : ${process.env.APP_PORT}! `);
});