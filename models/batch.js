const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    service : {
        type : String,
        required : true
    },
    date : {
        type : String
    },
    street : String,
    city : String,
    region : String,
    zip : String,
    country : String
});

const Batch = mongoose.model("Batch" , batchSchema);

module.exports = Batch;