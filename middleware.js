const Listing = require("./models/listing");
const Review = require("./models/reviews");
module.exports.isloggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next) =>{
    let {id} = req.params;
   let listing =await Listing.findById(id);
   if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
   if(!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "you dont have permission to edit");
     return res.redirect(`/listings/${id}`);
   }
};

module.exports.isauthor = async(req, res, next) =>{
    let {id, reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if (!review || !review.author) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

     if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "you dont have permission to delete this review");
     return res.redirect(`/listings/${id}`);
   }
   next();
};
