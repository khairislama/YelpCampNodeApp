const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
const Campground = mongoose.model("campground", campgroundSchema);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

app.post("/campgrounds", (req, res)=>{
    let name = req.body.name;
    let image = req.body.image;
    var newCampground = {name : name, image: image};
    Campground.create(newCampground, (err, newCampground)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

app.listen(3000, () =>{
    console.log("Serving is starting on port : 3000! ");
});