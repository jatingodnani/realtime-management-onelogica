const express= require('express');
const app = express();


app.post("/",(req,res)=>{
     res.json({success:true});
})

module.exports = app;
