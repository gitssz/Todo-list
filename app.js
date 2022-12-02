//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const date= require(__dirname+"/date.js");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); //allow us to render web pages using template files

const workItems = [];
const newItems = [];  


app.get("/", (req, res) => {
  //u req server n got html as response
  const Today= date.getDay();
 res.render("list", { listTitle:Today, addItems: newItems }); //pass a local variable, ejs:js
});
app.post("/", (req, res) => {
  //submitting data to server
  const item = req.body.newItem;
  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    newItems.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work", addItems: workItems });
});
// app.post("/work",(req,res)=>{
// res.redirect("/");
// })

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
