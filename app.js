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

const Today = date.getDay();
const itemSchema = new mongoose.Schema({
  name: String,
});

const itemsModel = new mongoose.model("item", itemSchema);

const i1 = { name: "welcome to todolist" };
const i2 = { name: "Hit + to add items" };
const i3 = { name: "<--hit this to delete items" };
const defaultItems = [i1, i2, i3];      //defaultItems->nested array

//list schema for dynamic route
const listSchema={
  name:String,
  items:[itemSchema]
}

const listModel =mongoose.model("list",listSchema)

app.get("/", (req, res) => {
  //u req server n got html as response
  itemsModel.find({}, function (err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length == 0) {     //if no items in todo list , add default items
        itemsModel.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully added default items");
          }
        });
        res.redirect("/");
      } else {  //if items are already present, then add the current item in todo-list
        res.render("list", { listTitle: Today, addItems: foundItems }); //pass a local variable, ejs:js
      // render->used for returning the rendered HTML of a view using the callback function.
      }
    }
  });
});

app.get("/:customName", (req, res) => {
  let custName = req.params.customName.toLowerCase();
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

app.post("/", (req, res) => {   //submitting data to server
  const addItemName = req.body.newItem;
  const listName=req.body.list;
  const addItem = new itemsModel({
    name: addItemName,
  });
if (listName===Today){     //inside default list
  addItem.save();
  res.redirect("/");
}
else{
listModel.findOne({name:listName},function(err,foundList){    //find that custom list in list Model
foundList.items.push(addItem);  //push item into array of items(which is of type item schema)
foundList.save();
res.redirect("/"+listName);
})
}
});

app.post("/delete", (req, res) => {
  const _listName = req.body.listName;
  const itemsId=req.body.checkedCheckbox;   //getting that checkbox name associated with the task
  console.log(itemsId);
  if(_listName===Today){
  itemsModel.deleteOne({ _id: itemsId }, function (err) {
    if (err) {
      console.log(err);
    }else {
      // console.log("successfully deleted item");
      res.redirect("/");
    }
  });
}
  else{
  listModel.findOneAndUpdate({name:_listName},{$pull:{items:{_id:itemsId}}},function(err){
  // listModel.updateOne({name:_listName},{$pull:{items:{_id:itemsId}}},function(err){
  if(err){
      console.log(err);
    }else{
      // console.log("successfully deleted");
      res.redirect("/"+_listName);
    }
    })}
});
//$pull-The $pull operator removes from an existing array all instances of a value or values that match a specified condition

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});