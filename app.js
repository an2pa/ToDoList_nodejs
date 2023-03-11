const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongodb = require("mongodb");
const datum = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _=require("lodash");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin-anes:test123@cluster0.qzhtq9v.mongodb.net/todolistDB');
        console.log("MongoDB connected");
    } catch (err) {
        console.log("Failed", err);
    }
}
connectDB();

const todolistSchema = {
    item: String
};
const workSchema = {
    item: String
};
const listSchema = {
    name: String,
    items: [todolistSchema]
}

const List = mongoose.model("List", listSchema);
const Item = mongoose.model("Item", todolistSchema);

const item1 = new Item({
    item: "Study"
})
const item2 = new Item({
    item: "Pray"
})
const item3 = new Item({
    item: "Train"
})

const defaultItems = [item1,item2,item3];






app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));




app.get("/", function (req, res) {

    var day = datum.getDatum();
    const promise = Item.find().exec();
    promise.then(function (doc) {
        res.render("list", { listTitle: day, newListItem: doc });
    })
})

app.post("/", function (req, res) {
    var itemToAdd = new Item({
        item: req.body.todo,
    })

    itemToAdd.save();
    res.redirect("/");
    //}
})


app.post("/delete", function (req, res) {
    var listDelete=req.body.listN;
    var itemToDelete = req.body.checkbox
    console.log(req.body.checkbox);
    const deleteF = Item.findOneAndDelete({ _id: itemToDelete }).exec();
    deleteF.then(function (doc) {
        console.log("Successfully deleted ")
    })
    res.redirect("/");
})

app.post("/deleteOther", function (req, res) {
    var listToDelete=req.body.listN;
    console.log(listToDelete)
    var itemToDelete = req.body.checkbox
    console.log(itemToDelete)
    const deleteF1 = List.findOneAndUpdate({ name: listToDelete }, {$pull:{items:{_id:itemToDelete}}}).exec();
    res.redirect("/"+req.body.listN);
})



app.get("/:routeName", function (req, res) {
    var rName = _.capitalize(req.params.routeName);
    const promise = List.find({ name: rName }).exec();
    promise.then(function (doc) {
        if (doc.length == 0) {
            console.log("List does not exist in DB so we will create it:")
            const list = new List({
                name: rName,
                items: defaultItems
            })
            list.save();
            const promise1 = List.findOne({name: rName}).exec();
            promise1.then(function (doc) {
                        res.render("other", { listTitle: rName, newListItem: doc.items, routeN: rName });
                    })
        }
        else {
            const promise1 = List.findOne({name: rName}).exec();
            promise1.then(function (doc) {
                        res.render("other", { listTitle: rName, newListItem: doc.items, routeN: rName });
                        
                    })
                }
                
            })
        })


app.post("/:routeName", function (req, res) {
    var rName = req.params.routeName;
    console.log(rName);
    const itemToAdd=new Item({
        item: req.body.todo1
    })
    console.log(req.body.todo)
    const promise1 = List.findOne({name: rName}).exec();
            promise1.then(function (doc) {
                doc.items.push(itemToAdd)
                console.log(doc.items)
                doc.save();
            })
    
    res.redirect(""+rName); 

})





app.listen(process.env.PORT || 3000, function () {
    console.log("Server started");
})