const express=require("express");
const env=require("dotenv");
env.config();
const app=express();
const socket=require("socket.io");
const http=require("http");
const authval=require('./routes/route')
app.use(express.json());
app.use("/",authval)

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});