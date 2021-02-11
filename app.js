const   express = require("express"),
        app = express(),
        bodyParser = require("body-parser");

let campgrounds = [
    {
        name: "Salmon Creek",
        image: "https://pixabay.com/get/g8c5b6cc7b6705d35cb5792fcec7b189b83c78063d97ba55057ada31250516bdb53d77565c3deeae882a27088fdc966db_340.jpg"
    },
    {
        name: "Granit Hill",
        image: "https://pixabay.com/get/geae749f76058df376e6bf12990223a87b350d8929f31c807e8c5a23c88e285f43e266147382bf33a6f97937e0e91e08e_340.jpg"
    },
    {
        name: "Montain Goat's Rest",
        image: "https://pixabay.com/get/g95703906910185d89bd053ac9a463caf45c17c2389c268e7fd58af1c64e3f985acec88ab19bbd8765d2c8f90c9034930_340.jpg"
    }
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/campgrounds", (req, res)=>{
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

app.post("/campgrounds", (req, res)=>{
    let name = req.body.name;
    let image = req.body.image;
    var newCampground = {name : name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.listen(3000, () =>{
    console.log("Serving is starting on port : 3000! ")
});