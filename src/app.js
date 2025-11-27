const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const {validateSignupData} = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');

app.use(express.json()); // the logic of processing json data
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRoter = require("./routes/request")
const userRouter = require("./routes/user");


app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRoter);
app.use("/user", userRouter)

// get user by email
app.get("/user", async (req, res) => {
    try {
        const emailId = req.body.emailId;
        if (!emailId) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email id is required!"
            })
        }
        const user = await User.findOne({ emailId: emailId });
        console.log(user)
        if (!user) {
            res.status(404).json({
                statusCode: 404,
                message: "User not found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "user found",
            user
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: err.message
        })
    }
})

// Feed api : GET / feed -> Fetch all the users from the database
app.get("x/feed", async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                message: "No user available , please add some user",
                data: []
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "Users fetched successfull",
            data: users
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Something went wrong",
            error: error.message
        });
    }
});

//update api || patch
app.patch("/user/:id", async (req, res) => {
    try {
        const id = req.params?.id;
        console.log(id)
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                message: "Id is required"
            })
        }

        const updateData = req.body;

        const ALLOWED_UPDATES = ["fullName", "age", "photoUrl", "skills", "about", "gender"];
        const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            return res.status(400).json({
                statusCode: 400,
                message: "Update is not allowed"
            })
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });
        console.log("updated user:", updatedUser);

        if (!updatedUser) {
            return res.status(400).json({
                statusCode: 404,
                message: "User not found"
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "User updated successfully",
            data: updatedUser
        })
    } catch (err) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error: err.message,
        })
    }
})

// Delete API
app.delete("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                message: "Id is required"
            })
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            })
        }

        res.status(200).json({
            statusCode: 200,
            message: "User deleted successsfully",
            deletedUser
        })


    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Something went wrong",
            error: error.message
        })
    }
})




app.use((err, req, res, next) => {
    res.status(500).json({
        statusCode: 500,
        message: "Something went wrong on the server!"
    });
});




app.get("/profile",userAuth, async(req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            statusCode: 200,
            data: user,
        })
    } catch (error) {
        console.error("Error fetching profile :", error.message);
        res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while fetching profile",
            error: error.message
        })
    }
})

app.post("sendConnectionRequest",userAuth, async(req, res)=>{
    const user = req.user;
    // sending connection request
    console.log("Sending connnection request");
    res.send(user.fullName + " send the connection request")
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

