const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5")

const app = express();



mongoose.connect("mongodb://localhost:27017/NewTonDB", {useUnifiedTopology: true ,useNewUrlParser: true});
mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema ({
    email : String,
    name: String,
    password : String,
})

const User = new mongoose.model("User", userSchema )

app.use(express.static("public"));
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req,res){
    res.render("register")
})

app.get("/register", function(req,res){
    res.render("register")
})

app.get("/login", function(req, res){
    res.render("login");
  });

  

app.post("/register", function(req,res){

    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: md5(req.body.password)
    });

    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("home")
        }
    })
    
})

app.post("/login", function(req,res){
    const username = req.body.email;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === password ){
                    res.render("home")
                }
                else{
                    res.send("<h1>No User Found</h1>")
                }
            }
        }
    })
})



app.listen(3000, function(req,res){
    console.log("Server started at port 3000!")
})
