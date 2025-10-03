const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        // type: String,
        // default: "https://www.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_3531881.htm#fromView=keyword&page=1&position=0&uuid=48908b01-72ff-4a4d-89b7-41ec5cd28fb6&query=Beach+sunset",
                    
        // set: (v) => v ===""
        //                  ?"https://www.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_3531881.htm#fromView=keyword&page=1&position=0&uuid=48908b01-72ff-4a4d-89b7-41ec5cd28fb6&query=Beach+sunset"
        //                 : v,
        url: String,
        filename: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;