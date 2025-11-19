const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")

app.post("/signup", async(req, res) => {

    console.log(req)
    const userObj = {
        firstName: "Manoranjan",
        lastName: "Parida",
        emailId: "mano@gmail.com",
        password:"Muna@123"
    }

    //creating a new instance of User model
    const user = new User(userObj);

    try {
        res.status(201).json({
        statusCode: 201,
        message: "User added successfully!!"
    })
    } catch (error) {
        
    }
    await user.save();

    
})

// first connected to database then start server and 
connectDB().then(() => {
    console.log("database connected successfully....")
    app.listen(3000, () => {
        console.log("Server is Running on PORT 3000");
    })
}).catch((err) => {
    console.error("Database can not be connected....")
})

