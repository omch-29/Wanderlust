const Listing = require("../models/listing");
const { listingSchema } = require("../schema.js");


module.exports.index = async (req, res) => {
    const { q } = req.query;
  let listings;

  if (q) {
    listings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } }
      ]
    });
    if (listings.length === 0) {
      req.flash("error", `We can’t find any listings for "${q}"`);
      return res.redirect("/listings");
    }
  } else {
  
    listings = await Listing.find({});
  }
     const alllistings = await Listing.find({});
    res.render("listings/index.ejs", {alllistings: listings, q, listings});
};

module.exports.renderNewForm = (req,res) =>{
    console.log(req.user);
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner").populate({
            path: "reviews",
            populate: { path: "author" }  
        });
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) =>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing =  new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    await newListing.save();
   req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) =>{
     let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req,res) =>{
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
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   if(typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
   }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) =>{
    let {id} = req.params;
    //let {id} = req.params;
   let listing =await Listing.findById(id);
   if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
   if(!listing.owner || !listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "you dont have permission to delete");
     return res.redirect(`/listings/${id}`);
   }
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
};