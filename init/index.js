const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() =>{
    console.log("connected to db");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initdb = async() =>{
    await Listing.deleteMany({});

      const modifiedData = initdata.data.map((obj) => {
    return {
      ...obj,
      image: obj.image.url, 
      
      image: {
        filename: obj.image.filename,
        url: obj.image.url,
    },
    owner: seedUserId,
  };
});

    // initdata.data = initdata.data.map((obj) => ({
    //   ...obj,
       
    //   }));

    await Listing.insertMany(modifiedData);
    console.log("data was initialized");
};

initdb();