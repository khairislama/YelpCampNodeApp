const seedDB = require("./seeds");

const   bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        express             = require("express"),
        methodOverride      = require("method-override"),
        expressSanitizer    = require("express-sanitizer"),
        dotenv              = require("dotenv"),
        passport            = require("passport"),
        localStrategy       = require("passport-local"),
        app                 = express(),
        Campground          = require("./models/compground"),
        Comment             = require("./models/comment"),
        User                = require("./models/user"),
        seedDb              = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
dotenv.config();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "yelpcamp is the best website to track the best camp sites in all over tunisia",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err){
            console.error(err);
        }else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=>{
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


// AUTH ROUTES
app.get("/register", (req, res)=>{
    res.render("register");
});
app.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.error(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", (req,res)=>{
    res.render("login");
});
app.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

app.listen(process.env.APP_PORT, () =>{
    console.log(`Serving is starting on port : ${process.env.APP_PORT}! `);
});