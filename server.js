const express = require('express');
const  bodyParser = require('body-parser');
const {connectDB} = require('./DB/db');
const {handlePostUrl,handleLinks,fetchData} = require('./Controllers/PostUrl')

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

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
    const qrcode= req.body.qrcode;

    handlePostUrl(longUrl,CustomUrl,password,startdate,enddate,qrcode);
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


app.get('/url',async (req,res)=>{
     const currentDate = new Date();
    const response = await fetchData()
    res.render('index',{response,currentDate})
})

app.listen(3000)