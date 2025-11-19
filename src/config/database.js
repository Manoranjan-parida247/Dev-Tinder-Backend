const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://manoranjanparida247:Muna%40feb18@namastenode.nr9joyp.mongodb.net/devTinder");
}

module.exports = connectDB;

