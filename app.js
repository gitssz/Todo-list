//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); //allow us to render web pages using template files
mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
});

// const workItems = [];
// const newItems = [];

const itemSchema = new mongoose.Schema({
  name: String,
});
const itemsModel = new mongoose.model("item", itemSchema);

// const i1=items.create({name:"welcome to todolist"})
// const i2= items.create({name:"Hit + to add items"})
// const i3=items.create({name:"<--hit this to delete items"})
// const defaultItems=[i1,i2,i3]
const i1 = { name: "welcome to todolist" };
const i2 = { name: "Hit + to add items" };
const i3 = { name: "<--hit this to delete items" };
const defaultItems = [i1, i2, i3];        //defaultItems->nested array

//list schema for synamic route
const listSchema={
  name:String,
  items:[itemSchema]
}

const listModel =mongoose.model("list",listSchema)

app.get("/", (req, res) => {
  //u req server n got html as response
  const Today = date.getDay();
  itemsModel.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length == 0) {
        itemsModel.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully added default items");
          }
        });
        res.redirect("/class");
      } else {
        res.render("list", { listTitle: Today, addItems: foundItems }); //pass a local variable, ejs:js
      // render->used for returning the rendered HTML of a view using the callback function.
      }
    }
  });
});

app.get("/:custName", (req, res) => {
  let custName = req.params.custName;
  // console.log(custName);
listModel.findOne({name:custName},function(err,result){
  if(!err){   //no error
    if(!result){      //if result doesnt exists 
      const customList = new listModel({
        name:custName,
        items:defaultItems    //default- welcome.....
    })
    customList.save();
    res.redirect("/"+custName)
    }
    else{
      // console.log("exists")
      res.render("list",{listTitle:result.name,addItems:result.items})
    }
  }
  else{
    console.log(err)
  }
})
});

app.post("/", (req, res) => {
  //submitting data to server
  const additemName = req.body.newItem;
  const addItem = new itemsModel({
    name: additemName,
  });
  addItem.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemsId=req.body.doneCheckbox;    //getting that checkbox associated with the task
  // console.log(itemsId);
  itemsModel.deleteOne({ _id: itemsId }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted item");
      res.redirect("/");
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
