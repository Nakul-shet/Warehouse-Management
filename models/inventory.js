const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    goods : {
        type : String,
        required : true
    },
    package : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    quantity : {
        type : Number
    },
    price : {
        type : Number,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    date : {
        type : String
    },
    time : {
        type : String
    }

});

const Inventory = mongoose.model("Inventory" , inventorySchema)

module.exports = Inventory;