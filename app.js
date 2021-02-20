const   seedDB              = require("./seeds");

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

//Requiring routes
const   commentRoutes       = require("./routes/comments"),
        campgroundRoutes    = require("./routes/campgrounds"),
        authRoutes          = require("./routes/auth");

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

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.APP_PORT, () =>{
    console.log(`Serving is starting on port : ${process.env.APP_PORT}! `);
});