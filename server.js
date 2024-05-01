const express = require('express');
const  bodyParser = require('body-parser');
const {connectDB} = require('./DB/db');
const {handlePostUrl,handleLinks,fetchData} = require('./Controllers/PostUrl')
const simpleId = require("simple-id");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    const shortUrl = CustomUrl || simpleId()

    handlePostUrl(longUrl,CustomUrl,password,startdate,enddate,qrcode,shortUrl)
   
   
        res.redirect(`/url/info/${shortUrl}`)
    
        
   
    
})

app.get('/url',async (req,res)=>{
    const currentDate = new Date();
   const response = await fetchData()
   res.render('index',{response,currentDate})
})

app.get('/url/info/:info',async (req,res)=>{
    const response = await fetchData()
    res.render('info',{response})
})

app.get('/url/:link',async (req,res)=>{
    const link = req.params.link;
    const password= req.query.password;
    const result= await handleLinks(link,password)
    if(link == 'undefined'){

        res.json({
            msg:"link expired"
        })
    }
    if(result){
        res.redirect(result.longUrl)
    }
   
    else{
        res.render('check.ejs',{link})
    }
})




app.listen(3000)