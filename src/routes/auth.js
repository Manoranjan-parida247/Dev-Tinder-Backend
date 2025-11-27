const express = require("express");
const {validateSignupData} = require("../utils/validation");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();
// what is difference between app.post and authRouter.post()

// SignUp API
authRouter.post("/signup", async(req, res) =>{
    // console.log(req.body)
    try{
        // Validdation of data
        validateSignupData(req);

        const {fullName, emailId, password} = req.body;

        // Encrypt the password and store it in the database
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({fullName, emailId, password: passwordHash});
        await user.save();
        // res.send("User added successfully")
        res.status(201).json({
            statusCode: 201,
            message: "User added succesfully",
        })
    }catch(err){
        res.status(400).json({
            statusCode: 400,
            message: "Error while saving user",
            error: err.message
        })
    }
})

// Login api
authRouter.post("/login", async(req, res) => {
    try{
        const {emailId, password} = req.body;

        // check for empty inputs
        if(!emailId || !password){
            return res.status(400).json({
                statusCode: 400,
                message: "Email and password are required",
            })
        }

        // find user by email
        const user = await User.findOne({emailId});
        if(!user){
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid credentials"
            });
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({
                statusCode: 401,
                message: "Invalid credentials"
            })
        }

        //generate JWT token
        const token = await jwt.sign({_id: user._id}, "Manoranjan247", {expiresIn: "7d"})
        
        // set token in cookie(optional)
        res.cookie("token", token, {maxAge: 7 * 24 * 60 * 60 * 1000});

        res.status(200).json({
            statusCode: 200,
            message: "Login successful",
            token //optionaly send in body if needed by frontend
        })

    }catch(err){
        res.status(500).json({
            statusCode: 500,
            message: "Error while logging in",
            error: err.message
        })
    }
})


// Logout api
authRouter.post("/logout", (req, res) => {
    try {
        res.cookie("token", null, {maxAge: 0})
        res.status(200).json({
            statusCode: 200,
            message: "Logout successfully"
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Error while logging out",
            error: error.message
        })
    }
})

module.exports = authRouter