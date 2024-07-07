const express=require("express");
const env=require("dotenv");
env.config();
const app=express();
const socket=require("socket.io");
const http=require("http");
const authval=require('./routes/route');
const connectDB = require("./mongoconnect");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();
app.use("/",authval)




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});