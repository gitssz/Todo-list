//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require('mongoose');
const { urlencoded } = require("body-parser");
const date= require(__dirname+"/date.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); //allow us to render web pages using template files
mongoose.connect("mongodb://localhost:27017/todolist",{useNewUrlParser: true});

// const workItems = [];
// const newItems = [];  

const itemSchema= new mongoose.Schema({    
  name:String
})
const itemsModel= new mongoose.model("item",itemSchema)    

// const i1=items.create({name:"welcome to todolist"})
// const i2= items.create({name:"Hit + to add items"})
// const i3=items.create({name:"<--hit this to delete items"})
// const itemArray=[i1,i2,i3]
const i1={name:"welcome to todolist"}
const i2= {name:"Hit + to add items"}
const i3={name:"<--hit this to delete items"}
const itemArray=[i1,i2,i3]

app.get("/", (req, res) => {
   //u req server n got html as response
   const Today= date.getDay();
  itemsModel.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
      if(foundItems.length==0){
        itemsModel.insertMany(itemArray,function(err){
          if(err){console.log(err)}
          else{
            console.log("successfully added deafult items")
          }
        })  
        res.redirect("/")
      }else{
        res.render("list", { listTitle:Today, addItems: foundItems }); //pass a local variable, ejs:js
      }
  }
  })

});

app.post("/", (req, res) => {
  //submitting data to server
  const additemName = req.body.newItem;
  // if (req.body.button === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   newItems.push(item);
  //   res.redirect("/");
  // }

const addItem = new itemsModel({   //add item 
  name:additemName
})
addItem.save();
res.redirect("/")

});

// app.get("/work", (req, res) => {
//   res.render("list", { listTitle: "Work", addItems: items });
// });

// app.post("/work",(req,res)=>{
// res.redirect("/");
// })



//delete item -> add dustbin icon next to each item added n then item should del after clicking on it
app.post("/delete",(req,res)=>{
  // console.log(req.body.Checkbox);
itemsModel.deleteOne({id:req.body.Checkbox},function(err){
  if(err){
    console.log(err)
  }
  else{
    console.log("successfully deleted item")
  res.redirect("/")

  }
})
})


app.get("/about", (req, res) => {
  res.render("about");
}); 

app.listen(3000, () => {
  console.log("server is running on port 3000");
});