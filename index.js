const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb+srv://admin:admin@cluster0.j97qo.mongodb.net/user?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//routes

//login
app.post("/login", (req, res)=> {
    const { email, password} = req.body
    User.findOne({ email: email}, (err, user) =>
     {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successfull", user: user})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

//update
app.post("/updateUser/:id", (req, res)=> {
    const { name, email, password, _id} = req.body
    User.findByIdAndUpdate(
        { _id: _id },
        { name: name },
        { email: email },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send({message: "User updated"});
          }
        }
      );
    
})


//register
app.post("/register", (req, res)=> {
    console.log(98787987);
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
})


app.listen(8000,() => {
    console.log("Started at port 8000")
})