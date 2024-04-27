const mongoose = require('mongoose')

async function connectDB(url){ 
    return mongoose.connect(url);
}


const UrlSchema = new mongoose.Schema({
    longUrl:{
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
    },
    CustomUrl:{
        type:String,
    },
    password:{
        type:String,
    },
    Clicks:{
        type:Number,
        default:0
    },
    startdate: {
        type:Date,
    },
    enddate: {
        type:Date
    },
    qrcode:{
        type:String
    }
})

const URL = mongoose.model("url",UrlSchema)

module.exports = connectDB;

module.exports = {
    connectDB,
    URL,
};
