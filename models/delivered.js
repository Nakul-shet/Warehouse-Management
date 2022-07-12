const mongoose = require("mongoose");

const deliveredSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    date : String,
    time : String

});

const Delivered = mongoose.model("Delivered" , deliveredSchema);

module.exports = Delivered;