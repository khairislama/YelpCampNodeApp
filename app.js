const   express = require("express"),
        app = express();

let campground = [
    {
        name: "Salmon Creek",
        image: ""
    },
    {
        name: "Granit Hill",
        image: ""
    },
    {
        name: "Montain Goat's Rest",
        image: ""
    }
]

app.set("view engine", "ejs");


app.get("/", (req, res)=>{
    res.render("home");
});

app.get("campgrounds", (req, res)=>{

});

app.listen(3000, () =>{
    console.log("Serving is starting on port : 3000! ")
});