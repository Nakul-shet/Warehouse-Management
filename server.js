require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const port = 3000;
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const connection = mongoose.connection;

mongoose.connect(process.env.MONGOOSE_CONNECTION , {useNewUrlParser : true , useUnifiedTopology : true});

connection.once("open" , () => {

    console.log("Connected to the Database");
});

connection.on("err" , (err) => {

    console.log(err)
})

const Inventory = require("./models/inventory");
const Batch = require("./models/batch");
const Order = require('./models/order');
const Delivered = require('./models/delivered');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.use(express.static("public"));

app.get("/" , (req , res) => {

    res.render("home");
})

app.get("/form" , (req , res) => {

    res.render("form");
})

app.post("/formdata" , (req , res) => {

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const goods = req.body.goods;
    const package = Number(req.body.package);
    const category = req.body.category;
    const quantity = Number(req.body.quantity);
    const price = Number(req.body.price);
    const amount = Number(req.body.amount);
    const date = currentDate;
    const time = currentTime;

    const inventoryData = new Inventory({
        goods : goods,
        package : package,
        category : category,
        quantity : quantity,
        price : price,
        amount : amount,
        date : date,
        time : time
    })

    inventoryData.save((err) => {
        if(!err){
            console.log("Data saved to the database");
        }else{
            console.log(err)
        }
    });

    res.redirect('/');

});

app.get("/inventory" , (req , res) => {

    Inventory.find({} , (err , foundData) => {

        if(!err){

            res.render("inventory" , {data : foundData});

        }else{

            console.log(err)
        }
    })


    
});

app.get('/stocks' , (req , res) => {


    Inventory.find({} , (err , foundItems) => {

        if(!err){

            res.render("stocks" , {data : foundItems});

        }else{
            console.log(err)
        }
    })
})

app.get('/generate' , (req , res) => {

    const records = [];

    Inventory.find({} , (err , foundRecords) => {

        if(!err){

            foundRecords.forEach((rec) => {

                const recordData = {
                    goods : rec.goods,
                    package : rec.package,
                    category : rec.category,
                    quantity : rec.quantity,
                    price : rec.price,
                    amount : rec.amount,
                    date : rec.date,
                    time : rec.time
                }
    
                records.push(recordData);
            })

            console.log(records);

            const workSheet = xlsx.utils.json_to_sheet(records);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook , workSheet , 'inventoryData');


    //for Buffer
    xlsx.write(workBook , {bookType : "xlsx" , type : "buffer"});

    xlsx.write(workBook , {bookType : "xlsx" , type : "binary"});

    xlsx.writeFile(workBook , "inventory.xlsx");

    res.redirect("/");
        }else{

            console.log(err)
        }

    })

});

app.get("/pending" , (req , res) => {

    const records = [];

    Order.find({} , (err , foundRecords) => {

        if(!err){

            foundRecords.forEach((rec) => {

                const recordData = {
                    name : rec.name,
                    quantity : rec.quantity,
                    price : rec.price,
                    date : rec.date,
                    time : rec.time
                }
    
                records.push(recordData);
            })

            console.log(records);

            const workSheet = xlsx.utils.json_to_sheet(records);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook , workSheet , 'orderData');


    //for Buffer
    xlsx.write(workBook , {bookType : "xlsx" , type : "buffer"});

    xlsx.write(workBook , {bookType : "xlsx" , type : "binary"});

    xlsx.writeFile(workBook , "orders.xlsx");

    res.redirect("/");
        }else{

            console.log(err)
        }

    })
});

app.get('/completed' , (req , res) => {

    const records = [];

    Delivered.find({} , (err , foundRecords) => {

        if(!err){

            foundRecords.forEach((rec) => {

                const recordData = {
                    name : rec.name,
                    quantity : rec.quantity,
                    price : rec.price,
                    date : rec.date,
                    time : rec.time
                }
    
                records.push(recordData);
            })

            console.log(records);

            const workSheet = xlsx.utils.json_to_sheet(records);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook , workSheet , 'deliveredData');


    //for Buffer
    xlsx.write(workBook , {bookType : "xlsx" , type : "buffer"});

    xlsx.write(workBook , {bookType : "xlsx" , type : "binary"});

    xlsx.writeFile(workBook , "delivered.xlsx");

    res.redirect("/");
        }else{

            console.log(err)
        }

    })
})

app.get('/orders' , (req , res) => {

    let names = [];

    Inventory.find({} , (err , foundItem) => {

        if(!err){

            foundItem.forEach((item) => {
                names.push(item.goods);
            })

            res.render("orders" , {categories : names})
        }
    })

});

app.post('/findAvail' , (req , res) => {

    let names = [];

    Inventory.find({} , (err , foundItem) => {

        if(!err){

            foundItem.forEach((item) => {
                names.push(item.goods);
            })
        }else{

            console.log(err)
        }
    })


    const finding = req.body.selected;

    Inventory.find({goods : finding} , (err , foundGoods) => {

        if(!err){

            if(foundGoods){

                console.log(foundGoods);

                console.log(typeof foundGoods[0].quantity);

                if(foundGoods[0].quantity >= 1){
    
                    res.render("orders" , {categories: names, msg : "Availability : In Stock" , stocks : foundGoods[0].quantity});
                    
                }else{
    
                    res.render("orders" , {categories: names, msg : "Availability :Out Of Stock" , stocks : foundGoods[0].quantity});

                }
            }else{
    
                console.log("Goods not available")
            }
        } else{

            console.log(err)
        }
    })
});

app.get('/order' , (req ,res) => {

    let names = [];

    Inventory.find({} , (err , foundItem) => {

        if(!err){

            foundItem.forEach((item) => {
                names.push(item.goods);
            })

            res.render("order" , {categories : names})
        }
    }) 
});

app.post("/proceed" , (req , res) => {
    
    const selected = req.body.selected;
    const quantity = Number(req.body.quantity);

    Inventory.findOne({goods : selected} , (err , foundGoods) => {

        if(foundGoods){

            if(foundGoods.quantity >= quantity){

                const newDate = new Date().toLocaleDateString();
                const newTime = new Date().toLocaleTimeString();

                foundGoods.quantity = foundGoods.quantity - quantity;

                foundGoods.save();
                
                const newOrder = {
                    name : foundGoods.goods,
                    quantity : quantity,
                    price : foundGoods.price * quantity,
                    date : newDate,
                    time : newTime
                }

                Order.create(newOrder , (err) => {
                    if(!err){
                        console.log("Ordered")
                    }else{
                        console.log(err)
                    }
                })

                res.redirect('/processing');
            }
        }
    })

    
});

app.get('/processing' , (req , res) => {

    Order.find({} , (err , foundOrders) => {

        res.render("processing" , {orders : foundOrders});
    })
})

app.post('/done' , (req , res) => {

    const newDate = new Date().toLocaleDateString();
    const newTime = new Date().toLocaleTimeString();

    const name = req.body.name;
    const quantity = req.body.quantity;
    const price = req.body.price;

    const newDelivered = new Delivered({
        name : name,
        quantity : quantity,
        price : price,
        date : newDate,
        time : newTime
    });

    newDelivered.save((err) => {
        if(!err){
            console.log("Delivered")
        }else{
            console.log(err)
        }
    })

    Order.deleteOne({name : name} , (err) => {
        if(!err){
            console.log("Deleted from the orders")
        }else{
            console.log(err)
        }
    })

    res.redirect('/');
})

app.listen(port , () => {
    console.log(`Server is up and running in port ${port}`)
})