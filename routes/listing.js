const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isloggedin} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.detials.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};
router.route("/")
.get(wrapAsync(listingController.index))
 .post(isloggedin,
    //validateListing,
    upload.single("listing[image]"),
     wrapAsync(listingController.createListing)
    );

//new route
router.get("/new", isloggedin, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
//.get(isloggedin,wrapAsync(listingController.renderEdit))
.put(isloggedin,
    upload.single("listing[image]"),
    validateListing, wrapAsync(listingController.updateListing)
)
.delete(isloggedin, wrapAsync(listingController.deleteListing));


//edit route
router.get("/:id/edit",isloggedin,wrapAsync(listingController.renderEdit));

//update route
//router.put("/:id",isloggedin,validateListing, wrapAsync(listingController.updateListing));

//Delete route
//router.delete("/:id",isloggedin, wrapAsync(listingController.deleteListing));

module.exports = router;