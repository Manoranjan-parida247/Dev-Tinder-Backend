const express = require('express');

const app = express();

app.use("/", (req, res)=> {
    res.send("Hello World");
})

app.use("/hello", (req, res)=> {
    res.send("Hello Route");
})

app.use("/test", (req, res)=> {
    res.send("Test Route");
})
app.listen(3000, ()=>{
    console.log("Server is Running on PORT 3000");
})