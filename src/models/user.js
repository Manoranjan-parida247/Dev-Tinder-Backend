const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    password:{
        type: String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    },
})

const User = mongoose.model("User", userSchema);
module.exports = User;

// module.exports = mongoose.model("User", userSchema); // same meaning  of above two line