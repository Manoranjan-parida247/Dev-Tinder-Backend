const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minLength:3,
        maxLength: 30,
        trim: true,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,


    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min: 18,
        max: 80
    },
    gender:{
        type: String,
        lowercase: true,
        //custom validation
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error ("Invalid gender data");
            }
        }
    },
    photoUrl:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOeZjZWEr4oFmJhILQQgTy7-WUX9BmRrAAFw&s"

    },
    about:{
        type: String,
        default: "This is default about of the user!"
    },
    skills:{
        type: [String]
    }

}, 
{
    timestamps: true
})

const User = mongoose.model("User", userSchema);
module.exports = User;

// module.exports = mongoose.model("User", userSchema); // same meaning  of above two line