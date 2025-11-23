const validator = require("validator");

const validateSignupData = (req) =>{
    const {fullName, emailId, password} = req.body;

    if(!fullName){
        throw new Error("Fullname is required");
    }

    if(fullName.length < 3 || fullName.length > 30){
        throw new Error("Fullname should be 3-30 characters");
    }
    
    if(!emailId){
        throw new Error ("Email id is required");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid email format")
    }

    if(!password){
        throw new Error("Password is required");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
        
    }
}

module.exports = {
    validateSignupData,
}