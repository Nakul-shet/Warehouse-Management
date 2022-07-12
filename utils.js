function findCategory(){

    let names = [];

    Inventory.find({} , (err , foundItem) => {

        if(!err){

            foundItem.forEach((item) => {
                names.push(item.goods);
            })

            res.render("orders" , {categories : names})
        }
    })
};

module.exports = findCategory;