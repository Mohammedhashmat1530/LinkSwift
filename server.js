const express = require('express');
const  bodyParser = require('body-parser');
const {connectDB} = require('./DB/db');
const {handlePostUrl,handleLinks} = require('./Controllers/PostUrl')

const app = express();


app.use(bodyParser.json());
const connectedDB = connectDB('mongodb+srv://hash:hash1@cluster0.1j7gdhi.mongodb.net/');
if(connectedDB){
    console.log("connect to DB")
}


app.post('/url',(req,res)=>{
    const longUrl= req.body.longUrl;
    const CustomUrl=req.body.CustomUrl;
    const password= req.body.password;
    const startdate= req.body.startdate;
    const enddate= req.body.enddate;

    handlePostUrl(longUrl,CustomUrl,password,startdate,enddate);
    res.json({
       msg:"done"
    })
})

app.get('/url/:link',async (req,res)=>{
    const link = req.params.link;
    const password= req.body.password;
    const result= await handleLinks(link,password)
    if(result){
        res.redirect(result.longUrl)
    }
    else{
        res.json({
            msg:"something is fishing"
        })
    }
})


app.listen(3000)