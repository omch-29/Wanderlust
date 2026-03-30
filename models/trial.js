const mongoose = rqeuire("mongoose");
const Schema = mongoose.Schema;

const trialSchema = new Schema({
    name:{
        type: String,
        unique: true,
        required:true,
    },
    number:{
        type: String,
    }
});

const Trial = mongoose.model("Trial",trialSchema);

module.exports=Trial;