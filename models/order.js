const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name : {
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
    date : {
        type : String
    },
    time : {
        type : String
    }
});

const Order = mongoose.model("Order" , orderSchema);

module.exports = Order;