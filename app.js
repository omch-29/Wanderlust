if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
    console.log("connected to db");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 20000
    });
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge: 7 * 24 * 60 * 60 *1000,
        httpOnly: true,
    },
};

app.get("/", (req,res) =>{
    res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const validateReview = (req, res, next) => {
    let { error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "studentsecond@gmail.com",
//         username: "trialagain-student"
//     });

//    const registeredUser = await User.register(fakeUser, "helloworld");
//    res.send(registeredUser);
// });
app.use("/listings", listingRouter);
app.use("/", userRouter);
//Reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync (async (req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newreview =new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "New Review created!");
    res.redirect(`/listings/${listing._id}`)
}));


//  app.all("/*", (req,res,next) =>{
//      next(new ExpressError(404,"page not found!"));
//  });

app.use((err, req, res, next) =>{
    let {statusCode =500, message="something went wrong"} = err;
    res.render("error.ejs", {message});
    //res.status(statusCode).send(message);
});
app.listen(3000, ()=>{
console.log("listening on 3000");
}
);
/*app.get("/testListing", async(req, res) =>{
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "By the beach",
        price: 1200,
        Location: "calcutta",
        country: "India",
    });

    await sampleListing.save();
    console.log("saved");
    res.send("successful")
});*/