const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async(req, res, next) => {
    try {
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            return res.status(401).json({
                statusCode: 401,
                message: "Unauthorized: no token provided"
            })
        }

        const decodedObj = jwt.verify(token, "Manoranjan247");
        const {_id} = decodedObj;

        const user = await User.findById(_id);

        if(!user){
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            })
        }

        req.user = user; //attach user to request object 
        next();
    } catch (err) {
        console.log("Auth error: ", err.message);
        return res.status(403).json({
            statusCode: 403,
            message: "Invalid or expired token"
        })
    }
}

module.exports = {
    userAuth
}